import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

// iPay88 Configuration
const IPAY88_CONFIG = {
  MERCHANT_CODE: process.env.IPAY88_MERCHANT_CODE || 'ID00001',
  MERCHANT_KEY: process.env.IPAY88_MERCHANT_KEY || 'your-merchant-key'
};

// Verify signature from iPay88
function verifySignature(params: any): boolean {
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
    Signature
  } = params;

  const signatureString = `${IPAY88_CONFIG.MERCHANT_KEY}${MerchantCode}${PaymentId}${RefNo}${Amount}${Currency}${Status}`;
  const calculatedSignature = crypto.createHash('sha256').update(signatureString).digest('hex');
  
  return calculatedSignature.toLowerCase() === Signature.toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Find order by order number
    const order = await prisma.order.findUnique({
      where: { orderNumber: RefNo }
    });

    if (!order) {
      console.error('Order not found:', RefNo);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
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

    // Return success response to iPay88
    return NextResponse.json({
      Status: 'OK',
      Message: 'Payment status updated successfully'
    });

  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET request for testing
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'iPay88 Payment Callback endpoint is active',
    timestamp: new Date().toISOString()
  });
} 