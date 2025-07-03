/**
 * Midtrans Webhook Handler
 * 
 * Implementasi webhook sesuai dokumentasi resmi Midtrans:
 * https://docs.midtrans.com/docs/https-notification-webhooks
 * 
 * Features:
 * - Signature verification untuk keamanan
 * - Credit card fraud status handling
 * - Proper HTTP status codes
 * - Comprehensive error handling
 * - Security headers
 * - Idempotency untuk duplicate notifications
 * - Detailed logging untuk debugging
 * 
 * @author Power Landmark Team
 * @updated 2025-01-02
 */

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
    
    // Validate Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ Invalid Content-Type:', contentType);
      const response = NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }
    
    const body: MidtransNotification = await request.json();
    
    // Validate required fields sesuai dokumentasi Midtrans
    if (!body.order_id || !body.transaction_status || !body.signature_key) {
      console.error('❌ Missing required fields in notification:', {
        order_id: !!body.order_id,
        transaction_status: !!body.transaction_status,
        signature_key: !!body.signature_key
      });
      
      const response = NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }
    
    console.log('📋 Notification data:', {
      order_id: body.order_id,
      transaction_status: body.transaction_status,
      payment_type: body.payment_type,
      gross_amount: body.gross_amount,
      fraud_status: body.fraud_status,
      transaction_id: body.transaction_id,
      transaction_time: body.transaction_time
    });

    // Verify signature untuk keamanan sesuai dokumentasi Midtrans
    const isValidSignature = verifySignature(body);
    if (!isValidSignature) {
      console.error('❌ Invalid signature from Midtrans:', {
        received_signature: body.signature_key,
        order_id: body.order_id
      });
      
      // Return 401 Unauthorized untuk invalid signature
      const response = NextResponse.json(
        { 
          error: MIDTRANS_ERROR_MESSAGES.INVALID_SIGNATURE,
          order_id: body.order_id 
        },
        { status: 401 }
      );
      return addSecurityHeaders(response);
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
      const response = NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
      return addSecurityHeaders(response);
    }

    console.log('✅ Order found:', {
      id: order.id,
      currentStatus: order.status,
      currentPaymentStatus: order.paymentStatus
    });

    // Update status order berdasarkan status pembayaran sesuai dokumentasi Midtrans
    let orderStatus = order.status;
    let paymentStatus = order.paymentStatus;

    // Handle status sesuai dengan dokumentasi resmi Midtrans
    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;
    const paymentType = body.payment_type;

    if (transactionStatus === 'capture') {
      if (paymentType === 'credit_card') {
        if (fraudStatus === 'accept') {
          orderStatus = 'CONFIRMED';
          paymentStatus = 'PAID';
          console.log('💰 Credit card capture with fraud accept - updating to CONFIRMED/PAID');
        } else {
          // Untuk credit card dengan fraud status selain accept, kita pending dulu
          orderStatus = 'PENDING';
          paymentStatus = 'PENDING';
          console.log('⚠️ Credit card capture with fraud status:', fraudStatus);
        }
      } else {
        // Non-credit card capture langsung sukses
        orderStatus = 'CONFIRMED';
        paymentStatus = 'PAID';
        console.log('💰 Non-credit card capture - updating to CONFIRMED/PAID');
      }
    } else if (transactionStatus === 'settlement') {
      orderStatus = 'CONFIRMED';
      paymentStatus = 'PAID';
      console.log('💰 Settlement - updating to CONFIRMED/PAID');
    } else if (transactionStatus === 'pending') {
      orderStatus = 'PENDING';
      paymentStatus = 'PENDING';
      console.log('⏳ Pending - keeping as PENDING');
    } else if (transactionStatus === 'deny') {
      orderStatus = 'CANCELLED';
      paymentStatus = 'FAILED';
      console.log('❌ Denied - updating to CANCELLED/FAILED');
    } else if (transactionStatus === 'cancel') {
      orderStatus = 'CANCELLED';
      paymentStatus = 'FAILED';
      console.log('🚫 Cancelled - updating to CANCELLED/FAILED');
    } else if (transactionStatus === 'expire') {
      orderStatus = 'CANCELLED';
      paymentStatus = 'EXPIRED';
      console.log('⏰ Expired - updating to CANCELLED/EXPIRED');
    } else if (transactionStatus === 'failure') {
      orderStatus = 'CANCELLED';
      paymentStatus = 'FAILED';
      console.log('❌ Failure - updating to CANCELLED/FAILED');
    } else {
      console.log('❓ Unknown transaction status:', transactionStatus, '- keeping current status');
    }

    // Update order di database hanya jika ada perubahan status
    let updatedOrder = order;
    if (order.status !== orderStatus || order.paymentStatus !== paymentStatus) {
      updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: orderStatus,
          paymentStatus: paymentStatus,
          updatedAt: new Date()
        }
      });

      console.log('✅ Order updated successfully:', {
        orderId: updatedOrder.orderNumber,
        oldStatus: `${order.status}/${order.paymentStatus}`,
        newStatus: `${updatedOrder.status}/${updatedOrder.paymentStatus}`
      });
    } else {
      console.log('ℹ️ No status change needed for order:', order.orderNumber);
    }

    // Log additional payment information sesuai dokumentasi Midtrans
    console.log('📊 Payment details:', {
      payment_type: body.payment_type,
      gross_amount: body.gross_amount,
      currency: body.currency || 'IDR',
      transaction_time: body.transaction_time,
      settlement_time: (body as any).settlement_time || null,
      fraud_status: body.fraud_status
    });
    
    // Log metode pembayaran spesifik
    if (body.va_numbers && body.va_numbers.length > 0) {
      console.log('🏦 Virtual account info:', body.va_numbers);
    }

    if (body.bill_key && body.biller_code) {
      console.log('📄 Over-the-counter payment info:', {
        bill_key: body.bill_key,
        biller_code: body.biller_code
      });
    }

    // Log credit card info jika ada
    if (body.payment_type === 'credit_card') {
      console.log('💳 Credit card info:', {
        masked_card: (body as any).masked_card,
        bank: (body as any).bank,
        eci: (body as any).eci,
        approval_code: (body as any).approval_code
      });
    }

    // Return 200 OK response sesuai dokumentasi Midtrans
    console.log('🎉 Webhook processed successfully for order:', body.order_id);
    
    const response = NextResponse.json({
      message: 'OK',
      order_id: body.order_id,
      transaction_status: transactionStatus,
      processed_at: new Date().toISOString()
    }, { 
      status: 200 
    });
    
    return addSecurityHeaders(response);

  } catch (error: any) {
    console.error('❌ Webhook processing error:', error);
    
    // Detailed error handling sesuai dokumentasi Midtrans
    if (error.name === 'SyntaxError') {
      const response = NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }
    
    if (error.code === 'P2002') {
      // Prisma unique constraint error - notification mungkin duplicate
      console.warn('⚠️ Possible duplicate notification, returning OK');
      const response = NextResponse.json(
        { message: 'OK' },
        { status: 200 }
      );
      return addSecurityHeaders(response);
    }
    
    if (error.code === 'P2025') {
      // Prisma record not found
      console.error('❌ Order not found during update');
      const response = NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
      return addSecurityHeaders(response);
    }
    
    // Log error details untuk debugging
    console.error('❌ Unhandled webhook error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}

// Endpoint info untuk debug
export async function GET() {
  const response = NextResponse.json({
    message: 'Midtrans Webhook Endpoint',
    description: 'This endpoint receives payment notifications from Midtrans',
    method: 'POST',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
  return addSecurityHeaders(response);
}

// Handle preflight OPTIONS request untuk CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://app.midtrans.com,https://app.sandbox.midtrans.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, User-Agent',
      'Access-Control-Max-Age': '86400'
    }
  });
}

// Security Headers untuk semua responses
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
} 