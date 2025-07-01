import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

// iPay88 Configuration
const IPAY88_CONFIG = {
  MERCHANT_CODE: process.env.IPAY88_MERCHANT_CODE || 'ID00001',
  MERCHANT_KEY: process.env.IPAY88_MERCHANT_KEY || 'your-merchant-key',
  REQUERY_URL: 'https://sandbox.ipay88.co.id/ePayment/WebService/PaymentAPI/RequeryPaymentStatusV2',
  PRODUCTION_REQUERY_URL: 'https://payment.ipay88.co.id/ePayment/WebService/PaymentAPI/RequeryPaymentStatusV2',
  IS_SANDBOX: process.env.NODE_ENV !== 'production'
};

// Generate signature for requery dengan format iPay88 yang benar
function generateRequerySignature(merchantCode: string, refNo: string, amount: string): string {
  // Format requery iPay88: ||MerchantKey||MerchantCode||RefNo||Amount||
  const signatureString = `||${IPAY88_CONFIG.MERCHANT_KEY}||${merchantCode}||${refNo}||${amount}||`;
  return crypto.createHash('sha256').update(signatureString).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { orderNumber } = await request.json();

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }

    // Find order in database
    const order = await prisma.order.findUnique({
      where: { orderNumber }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Prepare requery parameters
    const signature = generateRequerySignature(
      IPAY88_CONFIG.MERCHANT_CODE,
      orderNumber,
      order.totalAmount.toString()
    );

    const requeryParams = {
      ApiVersion: '2.0',
      MerchantCode: IPAY88_CONFIG.MERCHANT_CODE,
      RefNo: orderNumber,
      Amount: order.totalAmount.toString(),
      Signature: signature
    };

    // Make requery request to iPay88
    const requeryUrl = IPAY88_CONFIG.IS_SANDBOX 
      ? IPAY88_CONFIG.REQUERY_URL 
      : IPAY88_CONFIG.PRODUCTION_REQUERY_URL;

    const response = await fetch(requeryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requeryParams)
    });

    const ipay88Response = await response.json();

    if (ipay88Response.Status === '200' && ipay88Response.Message === '00') {
      const { Data } = ipay88Response;
      
      // Update order status based on requery result
      let orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' = 'PENDING';
      let paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED' = 'PENDING';

      if (Data.TransactionStatus === '1') {
        orderStatus = 'CONFIRMED';
        paymentStatus = 'PAID';
      } else if (Data.TransactionStatus === '0') {
        orderStatus = 'CANCELLED';
        paymentStatus = 'FAILED';
      }

      // Update order in database
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: orderStatus,
          paymentStatus,
          paymentToken: Data.TransId || order.paymentToken,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        orderNumber,
        status: orderStatus,
        paymentStatus,
        transactionId: Data.TransId,
        amount: Data.Amount,
        paymentDate: Data.PaymentDate,
        message: Data.ErrDesc || 'Payment status updated'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: ipay88Response.Message || 'Failed to query payment status',
        details: ipay88Response
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Payment status query error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('orderNumber');

  if (!orderNumber) {
    return NextResponse.json(
      { error: 'Order number is required' },
      { status: 400 }
    );
  }

  try {
    // Get order from database
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
            service: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if we have status from URL parameters (from iPay88 callback)
    const urlStatus = searchParams.get('status');
    const source = searchParams.get('source');
    
    let finalStatus = order.status;
    let finalPaymentStatus = order.paymentStatus;

    // If this comes from iPay88 callback with status parameter, use that
    if (source === 'ipay88' && urlStatus) {
      if (urlStatus === 'success') {
        finalStatus = 'CONFIRMED';
        finalPaymentStatus = 'PAID';
        
        // Update order in database
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
            updatedAt: new Date()
          }
        });
      } else if (urlStatus === 'failed') {
        finalStatus = 'CANCELLED';
        finalPaymentStatus = 'FAILED';
        
        // Update order in database
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'CANCELLED',
            paymentStatus: 'FAILED',
            updatedAt: new Date()
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      status: urlStatus === 'success' ? 'success' : urlStatus === 'failed' ? 'failed' : 'pending',
      order: {
        orderNumber: order.orderNumber,
        status: finalStatus,
        paymentStatus: finalPaymentStatus,
        totalAmount: order.totalAmount,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        items: order.items,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 