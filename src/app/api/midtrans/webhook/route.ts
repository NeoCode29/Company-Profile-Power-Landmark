import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  verifySignature, 
  parseTransactionStatus,
  MIDTRANS_ERROR_MESSAGES,
  MidtransNotification
} from '@/libs/midtrans';

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Midtrans webhook notification received');
    
    const body: MidtransNotification = await request.json();
    
    console.log('📋 Notification data:', {
      order_id: body.order_id,
      transaction_status: body.transaction_status,
      payment_type: body.payment_type,
      gross_amount: body.gross_amount,
      fraud_status: body.fraud_status,
      transaction_id: body.transaction_id
    });

    // Verify signature untuk keamanan
    const isValidSignature = verifySignature(body);
    if (!isValidSignature) {
      console.error('❌ Invalid signature from Midtrans:', {
        received_signature: body.signature_key,
        order_id: body.order_id
      });
      
      return NextResponse.json(
        { error: MIDTRANS_ERROR_MESSAGES.INVALID_SIGNATURE },
        { status: 401 }
      );
    }

    console.log('✅ Signature verification passed');

    // Parse status transaksi
    const { status, message } = parseTransactionStatus(body.transaction_status);
    
    console.log('🔄 Parsed transaction status:', {
      original: body.transaction_status,
      parsed: status,
      message
    });

    // Cari order berdasarkan order_id
    const order = await prisma.order.findUnique({
      where: { orderNumber: body.order_id }
    });

    if (!order) {
      console.error('❌ Order not found:', body.order_id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('✅ Order found:', {
      id: order.id,
      currentStatus: order.status,
      currentPaymentStatus: order.paymentStatus
    });

    // Update status order berdasarkan status pembayaran
    let orderStatus = order.status;
    let paymentStatus = order.paymentStatus;

    switch (status) {
      case 'success':
        orderStatus = 'CONFIRMED';
        paymentStatus = 'PAID';
        console.log('💰 Payment successful - updating order to CONFIRMED/PAID');
        break;
        
      case 'pending':
        orderStatus = 'PENDING';
        paymentStatus = 'PENDING';
        console.log('⏳ Payment pending - keeping status as PENDING');
        break;
        
      case 'failed':
        orderStatus = 'CANCELLED';
        paymentStatus = 'FAILED';
        console.log('❌ Payment failed - updating order to CANCELLED/FAILED');
        break;
        
      case 'cancelled':
        orderStatus = 'CANCELLED';
        paymentStatus = 'FAILED';
        console.log('🚫 Payment cancelled - updating order to CANCELLED/FAILED');
        break;
        
      case 'expired':
        orderStatus = 'CANCELLED';
        paymentStatus = 'EXPIRED';
        console.log('⏰ Payment expired - updating order to CANCELLED/EXPIRED');
        break;
        
      default:
        console.log('❓ Unknown status, keeping current status');
    }

    // Update order di database
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: orderStatus,
        paymentStatus: paymentStatus,
        updatedAt: new Date()
      }
    });

    console.log('✅ Order updated successfully:', {
      orderId: updatedOrder.orderNumber,
      newStatus: updatedOrder.status,
      newPaymentStatus: updatedOrder.paymentStatus
    });

    // Log additional payment information
    if (body.payment_type) {
      console.log('💳 Payment method:', body.payment_type);
    }
    
    if (body.va_numbers && body.va_numbers.length > 0) {
      console.log('🏦 Virtual account numbers:', body.va_numbers);
    }

    if (body.bill_key && body.biller_code) {
      console.log('📄 Bill payment info:', {
        bill_key: body.bill_key,
        biller_code: body.biller_code
      });
    }

    if (body.fraud_status) {
      console.log('🔍 Fraud status:', body.fraud_status);
    }

    // Return success response
    console.log('🎉 Webhook processed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Notification processed successfully',
      order_id: body.order_id,
      status: status
    });

  } catch (error: any) {
    console.error('❌ Webhook processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Endpoint info untuk debug
export async function GET() {
  return NextResponse.json({
    message: 'Midtrans Webhook Endpoint',
    description: 'This endpoint receives payment notifications from Midtrans',
    method: 'POST',
    environment: process.env.NODE_ENV || 'development'
  });
}

// Handle preflight OPTIONS request untuk CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
} 