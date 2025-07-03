import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
            service: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform order data for frontend
    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      items: order.items.map(item => ({
        id: item.id,
        name: item.product?.name || item.service?.name || 'Unknown Item',
        price: item.price,
        quantity: item.quantity,
        type: item.product ? 'product' : 'service',
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentToken: order.paymentToken,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { orderId, status, paymentStatus } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
    }
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
} 