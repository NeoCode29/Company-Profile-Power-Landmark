import { NextRequest, NextResponse } from 'next/server';
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
    // Validasi konfigurasi Midtrans
    const configValidation = validateMidtransConfig();
    if (!configValidation.isValid) {
      console.error('Midtrans configuration error:', configValidation.errors);
      return NextResponse.json(
        { 
          error: MIDTRANS_ERROR_MESSAGES.MISSING_CREDENTIALS,
          details: configValidation.errors 
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('📝 Midtrans create token request:', {
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      totalAmount: body.totalAmount,
      itemsCount: body.items?.length || 0
    });

    // Extract data dari request
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      totalAmount,
      items = [],
      customOrderId
    } = body;

    // Generate order ID unik
    const orderId = customOrderId || generateOrderId();

    // Split nama untuk first_name dan last_name
    const nameParts = customerName.split(' ');
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
        order_id: orderId,
        gross_amount: formatAmountForMidtrans(totalAmount)
      },
      customer_details: {
        first_name: firstName,
        last_name: lastName,
        email: customerEmail,
        phone: customerPhone || '08123456789',
        billing_address: {
          first_name: firstName,
          last_name: lastName,
          email: customerEmail,
          phone: customerPhone || '08123456789',
          address: customerAddress || 'Jakarta',
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
      custom_field2: orderId,
      custom_field3: items.length.toString()
    };

    // Validasi payload sebelum dikirim ke Midtrans
    const payloadValidation = validateTransactionPayload(transactionPayload);
    if (!payloadValidation.isValid) {
      console.error('Invalid transaction payload:', payloadValidation.errors);
      return NextResponse.json(
        { 
          error: MIDTRANS_ERROR_MESSAGES.INVALID_PAYLOAD,
          details: payloadValidation.errors 
        },
        { status: 400 }
      );
    }

    console.log('🚀 Creating Midtrans SNAP transaction:', {
      orderId,
      amount: transactionPayload.transaction_details.gross_amount,
      customer: `${firstName} ${lastName}`,
      itemsCount: itemDetails.length
    });

    // Create transaction di Midtrans
    const snapResponse = await createSnapTransaction(transactionPayload);

    console.log('✅ Midtrans SNAP token created:', {
      orderId,
      token: snapResponse.token ? '***TOKEN_RECEIVED***' : 'NO_TOKEN',
      redirectUrl: snapResponse.redirect_url ? 'URL_RECEIVED' : 'NO_URL'
    });

    return NextResponse.json({
      success: true,
      data: {
        token: snapResponse.token,
        redirect_url: snapResponse.redirect_url,
        order_id: orderId,
        gross_amount: transactionPayload.transaction_details.gross_amount
      }
    });

  } catch (error: any) {
    console.error('❌ Error creating Midtrans token:', error);
    
    let errorMessage = MIDTRANS_ERROR_MESSAGES.API_ERROR;
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