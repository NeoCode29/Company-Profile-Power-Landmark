import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Import Midtrans library
import { 
  createSnapTransaction, 
  generateOrderId, 
  formatAmountForMidtrans,
  validateMidtransConfig,
  validateTransactionPayload,
  MIDTRANS_ERROR_MESSAGES,
  MidtransSnapPayload
} from '@/libs/midtrans';

export async function POST(request: NextRequest) {
  try {
    console.log('=== MIDTRANS CHECKOUT DEBUG START ===');
    
    // Test database connection
    try {
      await prisma.$connect();
      console.log('✅ Database connection successful');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Validasi konfigurasi Midtrans
    const configValidation = validateMidtransConfig();
    if (!configValidation.isValid) {
      console.error('❌ Midtrans configuration error:', configValidation.errors);
      return NextResponse.json(
        { 
          error: MIDTRANS_ERROR_MESSAGES.MISSING_CREDENTIALS,
          details: configValidation.errors 
        },
        { status: 500 }
      );
    }

    const session = await auth();
    const body = await request.json();

    console.log('📝 Checkout request:', {
      itemsCount: body.items?.length || 0,
      customerName: body.customerInfo?.name,
      totalAmount: body.totalAmount,
      hasSession: !!session?.user
    });

    const {
      items,
      customerInfo,
      totalAmount
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('❌ Items validation failed:', items);
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      console.log('❌ Customer info validation failed:', customerInfo);
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      console.log('❌ Total amount validation failed:', totalAmount);
      return NextResponse.json(
        { error: 'Valid total amount is required' },
        { status: 400 }
      );
    }

    console.log('✅ Basic validation passed');

    // Validate items and check if products exist
    for (const item of items) {
      console.log('🔍 Validating item:', {
        id: item.id,
        type: item.type,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      });
      
      if (item.type === 'product') {
        // This is explicitly a product, validate it exists
        const product = await prisma.product.findUnique({
          where: { id: item.id }
        });

        if (!product) {
          console.log('❌ Product not found:', item.id);
          return NextResponse.json(
            { error: `Product with ID ${item.id} not found` },
            { status: 400 }
          );
        }
        console.log('✅ Product found:', product.name);
      } else {
        console.log('⏭️ Service item (no validation needed):', item.id);
      }
    }

    console.log('✅ Item validation passed');

    // Generate unique order number
    const orderNumber = generateOrderId();
    
    // Calculate total amount
    const calculatedTotal = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Validate calculated total matches sent total
    if (Math.abs(calculatedTotal - totalAmount) > 1) {
      console.log('❌ Amount mismatch:', { calculatedTotal, sentTotal: totalAmount });
      return NextResponse.json(
        { error: 'Amount calculation mismatch' },
        { status: 400 }
      );
    }

    console.log('💰 Order details:', {
      orderNumber,
      calculatedTotal,
      itemCount: items.length,
      customer: customerInfo.name
    });

    // Create order in database
    console.log('🔄 Creating order in database...');
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || null,
        status: 'PENDING',
        totalAmount: calculatedTotal,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address || '',
        paymentStatus: 'PENDING',
        items: {
          create: items.map((item: any) => {
            console.log('Processing item for DB:', {
              id: item.id,
              type: item.type,
              name: item.name
            });
            
            if (item.type === 'service') {
              // For services, productId must be null
              let sizeInfo = null;

              // Extract area/size from item name or id
              if (item.name.includes('m²')) {
                const sizeMatch = item.name.match(/(\d+)m²/);
                sizeInfo = sizeMatch ? `${sizeMatch[1]}m²` : null;
              } else if (item.name.includes(' - ')) {
                const parts = item.name.split(' - ');
                sizeInfo = parts[parts.length - 1];
              }

              return {
                productId: null,
                serviceId: null, // null for custom service orders
                quantity: item.quantity,
                price: item.price,
                size: sizeInfo
              };
            } else {
              // For products, use the item.id directly
              return {
                productId: item.id,
                serviceId: null,
                quantity: item.quantity,
                price: item.price,
                size: item.size || null
              };
            }
          })
        }
      }
    });

    console.log('✅ Order created successfully:', order.id);

    // Split nama untuk first_name dan last_name
    const nameParts = customerInfo.name.split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Format item details untuk Midtrans
    const itemDetails = items.map((item: any) => ({
      id: item.id,
      price: formatAmountForMidtrans(item.price),
      quantity: item.quantity,
      name: item.name,
      category: item.type || 'general',
      merchant_name: 'Power Landmark'
    }));

    // Prepare transaction payload untuk Midtrans SNAP
    const transactionPayload: MidtransSnapPayload = {
      transaction_details: {
        order_id: orderNumber,
        gross_amount: formatAmountForMidtrans(calculatedTotal)
      },
      customer_details: {
        first_name: firstName,
        last_name: lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        billing_address: {
          first_name: firstName,
          last_name: lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address || 'Jakarta',
          city: 'Jakarta',
          postal_code: '12190',
          country_code: 'IDN'
        }
      },
      item_details: itemDetails,
      credit_card: {
        secure: true
      },
      custom_field1: 'Power Landmark Order',
      custom_field2: orderNumber,
      custom_field3: items.length.toString()
    };

    // Validasi payload sebelum dikirim ke Midtrans
    const payloadValidation = validateTransactionPayload(transactionPayload);
    if (!payloadValidation.isValid) {
      console.error('❌ Invalid transaction payload:', payloadValidation.errors);
      return NextResponse.json(
        { 
          error: MIDTRANS_ERROR_MESSAGES.INVALID_PAYLOAD,
          details: payloadValidation.errors 
        },
        { status: 400 }
      );
    }

    console.log('🚀 Creating Midtrans SNAP transaction:', {
      orderId: orderNumber,
      amount: transactionPayload.transaction_details.gross_amount,
      customer: `${firstName} ${lastName}`,
      itemsCount: itemDetails.length
    });

    // Create transaction di Midtrans
    const snapResponse = await createSnapTransaction(transactionPayload);

    // Update order dengan payment token
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentToken: snapResponse.token,
        paymentUrl: snapResponse.redirect_url
      }
    });

    console.log('✅ Midtrans SNAP token created and order updated:', {
      orderId: orderNumber,
      token: snapResponse.token ? '***TOKEN_RECEIVED***' : 'NO_TOKEN',
      redirectUrl: snapResponse.redirect_url ? 'URL_RECEIVED' : 'NO_URL'
    });

    console.log('=== MIDTRANS CHECKOUT SUCCESS ===');

    return NextResponse.json({
      success: true,
      orderId: orderNumber,
      token: snapResponse.token,
      redirect_url: snapResponse.redirect_url,
      totalAmount: calculatedTotal,
      message: 'Order created successfully'
    });

  } catch (error: any) {
    console.error('❌ Checkout error:', error);
    
    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (error.message?.includes('Midtrans API Error')) {
      errorMessage = error.message;
      if (error.message.includes('400')) statusCode = 400;
      if (error.message.includes('401')) statusCode = 401;
      if (error.message.includes('409')) statusCode = 409;
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message 
      },
      { status: statusCode }
    );
  }
}

// Handle preflight OPTIONS request untuk CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
} 