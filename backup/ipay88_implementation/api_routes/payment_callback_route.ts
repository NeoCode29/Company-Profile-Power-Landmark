import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

// iPay88 Configuration
const IPAY88_CONFIG = {
  MERCHANT_CODE: process.env.IPAY88_MERCHANT_CODE || 'ID00001',
  MERCHANT_KEY: process.env.IPAY88_MERCHANT_KEY || 'your-merchant-key'
};

// Verify signature from iPay88 - Callback format dengan delimiter ||
function verifySignature(params: any): boolean {
  const {
    MerchantCode,
    PaymentId,
    RefNo,
    Amount,
    Currency,
    Status,
    Signature
  } = params;

  // Format callback iPay88: ||MerchantKey||MerchantCode||PaymentId||RefNo||Amount||Currency||Status||
  const signatureString = `||${IPAY88_CONFIG.MERCHANT_KEY}||${MerchantCode}||${PaymentId}||${RefNo}||${Amount}||${Currency}||${Status}||`;
  const calculatedSignature = crypto.createHash('sha256').update(signatureString).digest('hex');
  
  console.log('🔐 Callback signature verification (Correct Format):', {
    MerchantKey: IPAY88_CONFIG.MERCHANT_KEY ? '***SET***' : '***NOT SET***',
    expected: calculatedSignature.toLowerCase(),
    received: Signature ? Signature.toLowerCase() : 'N/A',
    match: calculatedSignature.toLowerCase() === (Signature || '').toLowerCase(),
    format: 'iPay88 format with || delimiters'
  });
  
  return calculatedSignature.toLowerCase() === (Signature || '').toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        body[key] = value;
      });
    }
    console.log('iPay88 Callback received:', body);

    const {
      MerchantCode,
      PaymentId,
      RefNo,
      Amount,
      Currency,
      Remark,
      TransId,
      AuthCode,
      Status,
      ErrDesc,
      Signature,
      PaymentDate
    } = body;

    // Verify signature
    if (!verifySignature(body)) {
      console.error('Invalid signature from iPay88');
      return NextResponse.json({
        Code: "0",
        Message: "Invalid signature"
      }, { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Find order by order number
    const order = await prisma.order.findUnique({
      where: { orderNumber: RefNo }
    });

    if (!order) {
      console.error('Order not found:', RefNo);
      return NextResponse.json({
        Code: "0",
        Message: "Order not found"
      }, { 
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Update order based on payment status
    let orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' = 'PENDING';
    let paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED' = 'PENDING';

    if (Status === '1') {
      // Payment successful
      orderStatus = 'CONFIRMED';
      paymentStatus = 'PAID';
    } else if (Status === '0') {
      // Payment failed
      orderStatus = 'CANCELLED';
      paymentStatus = 'FAILED';
    } else {
      // Payment pending or other status
      orderStatus = 'PENDING';
      paymentStatus = 'PENDING';
    }

    // Update order in database
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: orderStatus,
        paymentStatus,
        paymentToken: TransId || order.paymentToken,
        updatedAt: new Date()
      }
    });

    console.log(`Order ${RefNo} updated - Status: ${orderStatus}, Payment: ${paymentStatus}`);

    // Return success response to iPay88 in required format
    return NextResponse.json({
      Code: "1",
      Message: "Status Received"
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json({
      Code: "0",
      Message: "Internal server error"
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
}

// Handle GET request for testing
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'iPay88 Payment Callback endpoint is active',
    timestamp: new Date().toISOString()
  });
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
} 