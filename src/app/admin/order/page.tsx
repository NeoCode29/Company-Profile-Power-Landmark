'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  Download, 
  Eye, 
  RefreshCw,
  DollarSign,
  ShoppingCart,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'service';
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED';
  paymentToken: string | null;
  createdAt: string;
  updatedAt: string;
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load orders from API
  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } else {
        console.error('Failed to load orders:', data.error);
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm)
      );
    }

    // Filter by order status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by payment status
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PENDING':
      case 'PROCESSING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'CANCELLED':
      case 'FAILED':
      case 'EXPIRED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
      case 'FAILED':
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
    setIsDialogOpen(false);
  };

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    totalRevenue: orders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.totalAmount, 0)
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Kelola pesanan dan transaksi pelanggan</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={loadOrders} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Cari Order</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Order ID, Customer, Email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status">Filter Status Order</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="payment">Filter Payment</Label>
              <select
                id="payment"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Payment</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
                <option value="EXPIRED">Expired</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                Menampilkan {currentOrders.length} dari {filteredOrders.length} order
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Order</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {orders.length === 0 ? 'Belum Ada Order' : 'Tidak Ada Hasil'}
              </h3>
              <p className="text-gray-600">
                {orders.length === 0 
                  ? 'Order dari pelanggan akan muncul di sini'
                  : 'Coba ubah filter atau kata kunci pencarian'
                }
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Info</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{order.orderNumber}</div>
                            <div className="text-xs text-gray-500">ID: {order.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{order.customerName}</div>
                            <div className="text-xs text-gray-500">{order.customerEmail}</div>
                            <div className="text-xs text-gray-500">{order.customerPhone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{order.items.length} item(s)</div>
                            <div className="text-xs text-gray-500">
                              {order.items.slice(0, 2).map((item, idx) => (
                                <div key={idx}>{item.name} x{item.quantity}</div>
                              ))}
                              {order.items.length > 2 && (
                                <div>+{order.items.length - 2} more...</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-green-600">
                            {formatCurrency(order.totalAmount)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.paymentStatus)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.paymentStatus)}
                              {order.paymentStatus}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(order.createdAt)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(order)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-4">
                {currentOrders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{order.orderNumber}</div>
                          <div className="text-sm text-gray-500">{order.customerName}</div>
                        </div>
                        <div className="flex gap-1">
                          <Badge className={getStatusColor(order.status)} variant="secondary">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Email</div>
                          <div>{order.customerEmail}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Phone</div>
                          <div>{order.customerPhone}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Items</div>
                          <div>{order.items.length} item(s)</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Amount</div>
                          <div className="font-semibold text-green-600">
                            {formatCurrency(order.totalAmount)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Payment</div>
                          <Badge className={getStatusColor(order.paymentStatus)} variant="secondary">
                            {order.paymentStatus}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-gray-500">Date</div>
                          <div>{formatDate(order.createdAt)}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <div className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Order</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="border-b pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedOrder.orderNumber}</h3>
                    <p className="text-sm text-gray-500">Order ID: {selectedOrder.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status}
                      </div>
                    </Badge>
                    <Badge className={getStatusColor(selectedOrder.paymentStatus)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedOrder.paymentStatus)}
                        {selectedOrder.paymentStatus}
                      </div>
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tanggal Order</p>
                    <p className="text-sm text-gray-600">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tanggal Update</p>
                    <p className="text-sm text-gray-600">{formatDate(selectedOrder.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h4 className="text-md font-semibold mb-3">Informasi Pelanggan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Nama</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Telepon</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Alamat</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customerAddress}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-md font-semibold mb-3">Item yang Dipesan</h4>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                      <div className="col-span-5">Item</div>
                      <div className="col-span-2">Type</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-3 text-right">Price</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="px-4 py-3">
                        <div className="grid grid-cols-12 gap-4 text-sm">
                          <div className="col-span-5">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">ID: {item.id}</p>
                          </div>
                          <div className="col-span-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                          <div className="col-span-2">
                            <p className="text-center">{item.quantity}</p>
                          </div>
                          <div className="col-span-3 text-right">
                            <p className="font-medium">{formatCurrency(item.price)}</p>
                            <p className="text-xs text-gray-500">
                              Total: {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h4 className="text-md font-semibold mb-3">Informasi Pembayaran</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status Pembayaran</p>
                    <Badge className={getStatusColor(selectedOrder.paymentStatus)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedOrder.paymentStatus)}
                        {selectedOrder.paymentStatus}
                      </div>
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Payment Token</p>
                    <p className="text-sm text-gray-600 font-mono">
                      {selectedOrder.paymentToken || 'Not available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Items: {selectedOrder.items.length}</p>
                    <p className="text-sm text-gray-600">
                      Total Quantity: {selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleCloseDialog} variant="outline">
                  Tutup
                </Button>
                <Button 
                  onClick={() => window.open(`/payment/finish?order_id=${selectedOrder.orderNumber}`, '_blank')}
                  variant="secondary"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Lihat di Payment Page
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderPage; 