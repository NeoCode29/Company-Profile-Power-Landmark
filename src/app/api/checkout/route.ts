import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// iPay88 Configuration - Using real sandbox credentials
const IPAY88_CONFIG = {
  MERCHANT_CODE: process.env.IPAY88_MERCHANT_CODE || 'ID02189', // Real sandbox merchant code
  MERCHANT_KEY: process.env.IPAY88_MERCHANT_KEY || 'Lqb4Mpq4H7', // Real sandbox merchant key
  SANDBOX_URL: 'https://sandbox.ipay88.co.id/ePayment/WebService/PaymentAPI/Checkout',
  PRODUCTION_URL: 'https://payment.ipay88.co.id/ePayment/WebService/PaymentAPI/Checkout',
  IS_SANDBOX: process.env.NODE_ENV !== 'production'
};

// Generate SHA256 signature for iPay88
function generateSignature(params: any): string {
  // Format signature iPay88 yang benar dengan delimiter ||
  const {
    MerchantCode,
    RefNo,
    Amount,
    Currency
  } = params;

  // Format: ||MerchantKey||MerchantCode||RefNo||Amount||Currency||
  const signatureString = `||${IPAY88_CONFIG.MERCHANT_KEY}||${MerchantCode}||${RefNo}||${Amount}||${Currency}||`;
  
  console.log('🔐 Signature generation (Correct Format):', {
    MerchantKey: IPAY88_CONFIG.MERCHANT_KEY ? '***SET***' : '***NOT SET***',
    MerchantCode,
    RefNo,
    Amount,
    Currency,
    signatureLength: signatureString.length,
    format: 'iPay88 format with || delimiters'
  });
  
  return crypto.createHash('sha256').update(signatureString).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== CHECKOUT DEBUG START ===');
    
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

    // Check environment variables
    console.log('Environment check:', {
      IPAY88_MERCHANT_CODE: IPAY88_CONFIG.MERCHANT_CODE,
      IPAY88_MERCHANT_KEY: IPAY88_CONFIG.MERCHANT_KEY ? '***SET***' : '***NOT SET***',
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL
    });

    const session = await auth();
    const body = await request.json();

    console.log('Request body:', JSON.stringify(body, null, 2));
    console.log('Session:', session?.user);

    const {
      items,
      customerInfo,
      paymentMethod,
      totalAmount
    } = body;

    // Use user-selected payment method or default to QRIS
    const finalPaymentMethod = paymentMethod || '120'; // Default to QRIS if not specified
    console.log('🔄 Payment method received:', paymentMethod, '-> Using:', finalPaymentMethod);

    console.log('Extracted data:', {
      itemsLength: items?.length,
      customerInfo,
      paymentMethod,
      totalAmount
    });

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

    console.log('✅ Basic validation passed');

    // Validate items and check if products exist
    for (const item of items) {
      console.log('Validating item:', item);
      
      if (item.type === 'product') {
        console.log('🔍 Checking product existence for ID:', item.id);
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
        console.log('⏭️ Skipping validation for service item:', item.id);
      }
    }

    console.log('✅ Item validation passed');

    // Generate unique order number
    const orderNumber = `PL${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Calculate total amount
    const calculatedTotal = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);

    console.log('Order details:', {
      orderNumber,
      calculatedTotal,
      itemCount: items.length
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
            console.log('Processing item for DB:', item);
            
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

    // Prepare product description
    const prodDesc = items.length === 1 
      ? items[0].name 
      : `${items.length} items from Power Landmark`;

    // Prepare iPay88 request parameters  
    const baseUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/$/, ''); // Remove trailing slash
    
    console.log('🔗 Using base URL for callbacks:', baseUrl);
    
    const ipay88Params = {
      APIVersion: '2.0',
      MerchantCode: IPAY88_CONFIG.MERCHANT_CODE,
      PaymentId: finalPaymentMethod, // Send as string, not integer
      Currency: 'IDR',
      RefNo: orderNumber,
      Amount: calculatedTotal.toString(),
      ProdDesc: prodDesc,
      RequestType: 'REDIRECT', // ✅ Sesuai dokumentasi iPay88 - default method
      UserName: customerInfo.name,
      UserEmail: customerInfo.email,
      UserContact: customerInfo.phone,
      Remark: `Order from Power Landmark - ${orderNumber}`,
      Lang: 'ISO-8859-1',
      ResponseURL: `${baseUrl}/payment/status?orderNumber=${orderNumber}`,
      BackendURL: `${baseUrl}/api/payment/callback`
    };

    // Generate signature dengan format yang benar: ||MerchantKey||MerchantCode||RefNo||Amount||Currency||
    const signature = generateSignature({
      MerchantCode: IPAY88_CONFIG.MERCHANT_CODE,
      RefNo: orderNumber,
      Amount: calculatedTotal.toString(),
      Currency: 'IDR'
    });
    const requestPayload = {
      ...ipay88Params,
      Signature: signature
    };

    console.log('iPay88 request payload (signature hidden):', {
      ...requestPayload,
      Signature: '***HIDDEN***'
    });

    // Make request to iPay88
    const ipay88Url = IPAY88_CONFIG.IS_SANDBOX 
      ? IPAY88_CONFIG.SANDBOX_URL 
      : IPAY88_CONFIG.PRODUCTION_URL;

    console.log('🔄 Making request to iPay88:', ipay88Url);

    // Only use TEST MODE if merchant key is placeholder
    if (IPAY88_CONFIG.MERCHANT_KEY === 'your-merchant-key') {
      console.log('⚠️ Enabling TEST MODE - using placeholder merchant key');
      
      // Mock successful response for testing - simulate real iPay88 flow
      const mockResponse = {
        Status: '200',
        Message: '00',
        Data: {
          MerchantCode: IPAY88_CONFIG.MERCHANT_CODE,
          PaymentId: finalPaymentMethod,
          RefNo: orderNumber,
          Amount: calculatedTotal.toString(),
          Currency: 'IDR',
          TransId: 'TEST_' + Date.now(),
          AuthCode: 'TEST_AUTH',
          TransactionStatus: '1',
          ErrDesc: '',
          Signature: 'test_signature',
          PaymentDate: new Date().toISOString()
        }
      };

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentToken: mockResponse.Data.TransId,
          paymentUrl: `${baseUrl}/payment/test-payment?orderNumber=${orderNumber}&amount=${calculatedTotal}&transId=${mockResponse.Data.TransId}`,
          paymentStatus: 'PENDING'
        }
      });

      console.log('✅ Mock payment initiated successfully');
      return NextResponse.json({
        success: true,
        orderNumber,
        paymentUrl: `${baseUrl}/payment/test-payment?orderNumber=${orderNumber}&amount=${calculatedTotal}&transId=${mockResponse.Data.TransId}`,
        transactionId: mockResponse.Data.TransId,
        message: 'Payment initiated successfully (TEST MODE)'
      });
    }

    // Proceed with real iPay88 API call
    console.log('🔄 Proceeding with real iPay88 API call to:', ipay88Url);
    console.log('🔐 Using merchant code:', IPAY88_CONFIG.MERCHANT_CODE);

    const response = await fetch(ipay88Url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload)
    });

    const ipay88Response = await response.json();
    console.log('iPay88 response:', ipay88Response);

    // ✅ Check response format sesuai dokumentasi iPay88 API 2.0
    // Success: Status: "200", Message: "00"
    // Fail: Status selain "200" atau Message selain "00"
    if (ipay88Response.Status === '200' && ipay88Response.Message === '00' && ipay88Response.Data) {
      // ✅ Untuk RequestType 'REDIRECT', akan mendapat payment URL di response
      // atau perlu membuat redirect URL dari parameter yang ada
      
      let paymentUrl: string;
      
      if (ipay88Response.Data.PaymentURL) {
        // Jika response sudah ada PaymentURL langsung
        paymentUrl = ipay88Response.Data.PaymentURL;
      } else {
        // Jika tidak ada PaymentURL, buat redirect URL ke iPay88 payment gateway
        const paymentBaseUrl = IPAY88_CONFIG.IS_SANDBOX 
          ? 'https://sandbox.ipay88.co.id/ePayment/webform'
          : 'https://payment.ipay88.co.id/ePayment/webform';
        
        // Build redirect URL dengan parameter lengkap
        const paymentParams = new URLSearchParams({
          MerchantCode: IPAY88_CONFIG.MERCHANT_CODE,
          PaymentId: finalPaymentMethod,
          RefNo: orderNumber,
          Amount: calculatedTotal.toString(),
          Currency: 'IDR',
          ProdDesc: prodDesc,
          UserName: customerInfo.name,
          UserEmail: customerInfo.email,
          UserContact: customerInfo.phone,
          Remark: ipay88Params.Remark,
          Lang: 'ISO-8859-1',
          ResponseURL: ipay88Params.ResponseURL,
          BackendURL: ipay88Params.BackendURL,
          Signature: signature
        });
        
        paymentUrl = `${paymentBaseUrl}?${paymentParams.toString()}`;
      }
      
      // Update order dengan payment info
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentToken: ipay88Response.Data.TransId,
          paymentUrl: paymentUrl,
          paymentStatus: 'PENDING'
        }
      });

      console.log('✅ iPay88 payment request successful');
      console.log('🔗 Payment URL:', paymentUrl);
      console.log('🔗 Transaction ID:', ipay88Response.Data.TransId);
      
      return NextResponse.json({
        success: true,
        orderNumber,
        transactionId: ipay88Response.Data.TransId,
        paymentUrl: paymentUrl,
        message: 'Payment initiated successfully'
      });
    } else {
      console.log('❌ iPay88 payment failed:', ipay88Response);
      
      // Update order status to failed
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'CANCELLED',
          paymentStatus: 'FAILED'
        }
      });

      return NextResponse.json({
        success: false,
        error: ipay88Response.Message || 'Payment initiation failed',
        details: ipay88Response
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 