import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to create user-friendly status message
function createUserFriendlyStatusMessage(paymentStatus: string): string {
  switch (paymentStatus) {
    case 'PAID':
      return 'Pembayaran berhasil dikonfirmasi';
    case 'PENDING':
      return 'Pembayaran sedang dalam proses';
    case 'FAILED':
      return 'Pembayaran gagal atau ditolak';
    case 'EXPIRED':
      return 'Pembayaran telah kadaluarsa';
    case 'REFUNDED':
      return 'Pembayaran telah direfund';
    default:
      return 'Status pembayaran tidak diketahui';
  }
}

// Helper function to map database payment status to Midtrans format
function mapPaymentStatusToMidtrans(paymentStatus: string): string {
  switch (paymentStatus) {
    case 'PAID':
      return 'settlement';
    case 'PENDING':
      return 'pending';
    case 'FAILED':
      return 'failure';
    case 'EXPIRED':
      return 'expire';
    case 'REFUNDED':
      return 'refund';
    default:
      return 'pending';
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id');

  if (!orderId) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Order ID is required' 
      },
      { status: 400 }
    );
  }

  try {
    console.log(`🔍 Checking payment status for order: ${orderId} (Database Only)`);
    
    // Get order from database only - no Midtrans API call
    const order = await prisma.order.findUnique({
      where: { orderNumber: orderId },
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
      console.error(`❌ Order not found in database: ${orderId}`);
      return NextResponse.json(
        { 
          success: false,
          error: 'Order tidak ditemukan' 
        },
        { status: 404 }
      );
    }

    console.log(`✅ Order found in database:`, {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt
    });

    // Create payment response from database data
    const paymentResponse = {
      order_id: order.orderNumber,
      transaction_id: order.paymentToken || order.orderNumber,
      transaction_status: mapPaymentStatusToMidtrans(order.paymentStatus),
      payment_type: 'database_record',
      gross_amount: order.totalAmount.toString(),
      transaction_time: order.createdAt.toISOString(),
      fraud_status: 'accept',
      status_message: createUserFriendlyStatusMessage(order.paymentStatus),
      currency: 'IDR',
      merchant_id: process.env.MIDTRANS_MERCHANT_ID || '',
      note: 'Status diambil dari database lokal'
    };

    console.log(`📊 Payment response created:`, {
      order_id: paymentResponse.order_id,
      transaction_status: paymentResponse.transaction_status,
      status_message: paymentResponse.status_message
    });

    return NextResponse.json({
      success: true,
      payment: paymentResponse,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items
      },
      isOfflineStatus: true,
      dataSource: 'database',
      lastUpdated: order.updatedAt.toISOString()
    });

  } catch (error) {
    console.error('❌ Payment status query error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Terjadi kesalahan saat mengambil data pembayaran' 
      },
      { status: 500 }
    );
  }
} 