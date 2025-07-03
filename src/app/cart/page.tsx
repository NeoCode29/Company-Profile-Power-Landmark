'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Search, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  Trash2,
  ShoppingCart
} from 'lucide-react';

interface PaymentHistory {
  orderId: string;
  transactionId: string;
  amount: number;
  status: string;
  paymentType: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, selectedItems, setSelectedItems, selectedTotalPrice } = useCart();
  const router = useRouter();
  
  // Payment History State
  const [history, setHistory] = useState<PaymentHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<PaymentHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Load payment history from localStorage
  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem('payment_history');
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          setHistory(parsedHistory);
          setFilteredHistory(parsedHistory);
        }
      } catch (error) {
        console.error('Error loading payment history:', error);
      }
    };

    loadHistory();
  }, []);

  // Filter history based on search and status
  useEffect(() => {
    let filtered = history;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredHistory(filtered);
  }, [history, searchTerm, statusFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(cartItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const isService = (item: any) => {
    return item.type === 'service' || item.id.startsWith('service-');
  };

  // Payment History Helper Functions
  const clearHistory = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat pembayaran?')) {
      localStorage.removeItem('payment_history');
      setHistory([]);
      setFilteredHistory([]);
    }
  };

  const removePayment = (orderId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      const updatedHistory = history.filter(item => item.orderId !== orderId);
      localStorage.setItem('payment_history', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'capture':
      case 'settlement':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'deny':
      case 'cancel':
      case 'expire':
      case 'failure':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'capture':
      case 'settlement':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'deny':
      case 'cancel':
      case 'expire':
      case 'failure':
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const historyStats = {
    total: history.length,
    successful: history.filter(h => h.status === 'capture' || h.status === 'settlement').length,
    pending: history.filter(h => h.status === 'pending').length,
    totalAmount: history.reduce((sum, h) => sum + h.amount, 0)
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-48">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cart & Payment History</h1>
          
          <Tabs defaultValue="cart" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cart" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Shopping Cart ({cartItems.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Payment History ({history.length})
              </TabsTrigger>
            </TabsList>

            {/* Cart Tab */}
            <TabsContent value="cart" className="space-y-6">
              {cartItems.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600 mb-4">Add some products to get started</p>
                    <Button onClick={() => router.push('/products')}>
                      Start Shopping
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          id="select-all"
                          checked={selectedItems.length === cartItems.length}
                          onCheckedChange={handleSelectAll}
                        />
                        <label htmlFor="select-all" className="text-sm font-medium text-gray-700">
                          Select All Items
                        </label>
                      </div>
                    </div>

                    {cartItems.map((item) => {
                      const isServiceItem = isService(item);
                      return (
                        <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 mb-4">
                          <div className="flex items-center gap-4">
                            <Checkbox
                              id={`select-${item.id}`}
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                            />
                            <div className="relative w-24 h-24">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                              <p className="text-green-600 font-bold mt-1">{formatPrice(item.price)}</p>
                              <div className="flex items-center gap-4 mt-2">
                                {isServiceItem ? (
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                                      Service
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center border rounded-md">
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    >
                                      -
                                    </button>
                                    <span className="px-3 py-1">{item.quantity}</span>
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    >
                                      +
                                    </button>
                                  </div>
                                )}
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Selected Items</span>
                          <span className="font-semibold">{selectedItems.length} items</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">{formatPrice(selectedTotalPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-semibold">Free</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-green-600">{formatPrice(selectedTotalPrice)}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (selectedItems.length > 0) {
                            router.push('/checkout');
                          }
                        }}
                        className={`w-full py-3 rounded-lg transition-colors duration-300 ${
                          selectedItems.length > 0 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={selectedItems.length === 0}
                      >
                        Proceed to Checkout ({selectedItems.length} items)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Payment History Tab */}
            <TabsContent value="history" className="space-y-6">
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Transaksi</p>
                        <p className="text-2xl font-bold">{historyStats.total}</p>
                      </div>
                      <History className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Berhasil</p>
                        <p className="text-2xl font-bold text-green-600">{historyStats.successful}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Menunggu</p>
                        <p className="text-2xl font-bold text-yellow-600">{historyStats.pending}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Nilai</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(historyStats.totalAmount)}
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="search">Cari Transaksi</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="search"
                          placeholder="Order ID, Transaction ID, Nama, Email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="status">Filter Status</Label>
                      <select
                        id="status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">Semua Status</option>
                        <option value="capture">Berhasil (Capture)</option>
                        <option value="settlement">Selesai (Settlement)</option>
                        <option value="pending">Menunggu (Pending)</option>
                        <option value="deny">Ditolak (Deny)</option>
                        <option value="cancel">Dibatalkan (Cancel)</option>
                        <option value="expire">Kadaluarsa (Expire)</option>
                        <option value="failure">Gagal (Failure)</option>
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <Button 
                        onClick={clearHistory}
                        variant="outline"
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus Semua
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* History List */}
              {filteredHistory.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {history.length === 0 ? 'Belum Ada Riwayat Pembayaran' : 'Tidak Ada Hasil'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {history.length === 0 
                        ? 'Riwayat pembayaran Anda akan muncul di sini setelah melakukan transaksi'
                        : 'Coba ubah filter atau kata kunci pencarian'
                      }
                    </p>
                    <Button onClick={() => router.push('/products')}>
                      Mulai Berbelanja
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredHistory.map((payment, index) => (
                    <Card key={payment.orderId} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {getStatusIcon(payment.status)}
                              {payment.orderId}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {formatDate(payment.createdAt)}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Transaction ID:</span>
                              <span className="font-mono">{payment.transactionId}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Payment Type:</span>
                              <span className="capitalize">{payment.paymentType.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Customer:</span>
                              <span>{payment.customerName}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-semibold text-lg">
                                {formatCurrency(payment.amount)}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Items ({payment.items.length}):</span>
                              <div className="mt-1">
                                {payment.items.slice(0, 2).map((item, itemIndex) => (
                                  <div key={itemIndex} className="text-xs text-gray-500">
                                    {item.name} x{item.quantity}
                                  </div>
                                ))}
                                {payment.items.length > 2 && (
                                  <div className="text-xs text-gray-500">
                                    +{payment.items.length - 2} item lainnya
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/payment/finish?order_id=${payment.orderId}`)}
                          >
                            Lihat Detail
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/payment/status`)}
                          >
                            Cek Status
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removePayment(payment.orderId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
} 