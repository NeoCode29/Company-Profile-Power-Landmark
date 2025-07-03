'use client';

import React, { useState, useEffect } from 'react';

// Extend Window interface untuk Midtrans SNAP
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess?: (result: any) => void;
        onPending?: (result: any) => void;
        onError?: (result: any) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import { formatPrice } from '@/lib/utils';
import { MIDTRANS_PAYMENT_METHODS, MIDTRANS_PAYMENT_LABELS, getSnapUrl } from '@/libs/midtrans';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, CreditCard, Smartphone, Building, Store } from 'lucide-react';
import Image from 'next/image';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const CheckoutPage: React.FC = () => {
  const { cartItems, selectedItems, selectedTotalPrice, getSelectedCartItems, removeSelectedItems } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: ''
  });
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all_payments');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const selectedCartItems = getSelectedCartItems();

  // Redirect if no items to checkout
  useEffect(() => {
    if (selectedCartItems.length === 0) {
      router.push('/cart');
    }
  }, [selectedCartItems, router]);

  // Update customer info when session changes
  useEffect(() => {
    if (session?.user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email
      }));
    }
  }, [session]);

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};
    
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }
    
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^(\+62|62|0)[0-9]{9,13}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }
    
    if (!customerInfo.address.trim()) {
      newErrors.address = 'Alamat wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      console.log('🔄 Processing checkout with Midtrans SNAP...');
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedCartItems,
          customerInfo: customerInfo,
          totalAmount: selectedTotalPrice,
        }),
      });

      const result = await response.json();

      if (result.success && result.token) {
        console.log('✅ Checkout successful, initializing Midtrans SNAP');
        
        // Load Midtrans SNAP script jika belum ada
        if (!window.snap) {
          const script = document.createElement('script');
          script.src = getSnapUrl();
          script.setAttribute('data-client-key', 'SB-Mid-client-your-client-key');
          document.body.appendChild(script);
          
          script.onload = () => {
            console.log('📜 Midtrans SNAP script loaded');
            openSnapPayment(result.token, result.orderId);
          };
        } else {
          openSnapPayment(result.token, result.orderId);
        }
        
      } else {
        throw new Error(result.error || 'Gagal membuat token pembayaran');
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
      alert(`Terjadi kesalahan: ${error instanceof Error ? error.message : 'Silakan coba lagi'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to save payment history
  const savePaymentHistory = (status: string, result: any, orderIdParam: string) => {
    const paymentHistory = {
      orderId: orderIdParam,
      transactionId: result?.transaction_id || `temp-${Date.now()}`,
      amount: selectedTotalPrice,
      status: status,
      paymentType: result?.payment_type || 'unknown',
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      items: selectedCartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Import PaymentHistoryManager dynamically to avoid SSR issues
    import('@/lib/paymentHistory').then(({ PaymentHistoryManager }) => {
      PaymentHistoryManager.savePayment(paymentHistory);
    }).catch(error => {
      console.error('Error saving payment history:', error);
    });
  };

  const openSnapPayment = (token: string, orderId: string) => {
    console.log('🚀 Opening Midtrans SNAP payment popup');
    
    window.snap.pay(token, {
      onSuccess: function(result: any) {
        console.log('✅ Payment successful:', result);
        
        // Save to payment history
        savePaymentHistory('capture', result, orderId);
        
        alert('Pembayaran berhasil!');
        
        // Clear selected items dari cart
        removeSelectedItems();
        
        // Redirect ke halaman success
        router.push(`/payment/finish?order_id=${orderId}&transaction_status=capture&transaction_id=${result.transaction_id}&payment_type=${result.payment_type}&gross_amount=${selectedTotalPrice}&transaction_time=${new Date().toISOString()}&status_message=Success`);
      },
      onPending: function(result: any) {
        console.log('⏳ Payment pending:', result);
        
        // Save to payment history
        savePaymentHistory('pending', result, orderId);
        
        alert('Pembayaran menunggu konfirmasi. Silakan selesaikan pembayaran Anda.');
        
        // Redirect ke halaman pending
        router.push(`/payment/finish?order_id=${orderId}&transaction_status=pending&transaction_id=${result.transaction_id}&payment_type=${result.payment_type}&gross_amount=${selectedTotalPrice}&transaction_time=${new Date().toISOString()}&status_message=Pending`);
      },
      onError: function(result: any) {
        console.error('❌ Payment error:', result);
        
        // Save to payment history
        savePaymentHistory('failure', result, orderId);
        
        alert('Pembayaran gagal. Silakan coba lagi.');
        
        // Redirect ke halaman error
        router.push(`/payment/finish?order_id=${orderId}&transaction_status=failure&transaction_id=${result?.transaction_id || 'unknown'}&payment_type=${result?.payment_type || 'unknown'}&gross_amount=${selectedTotalPrice}&transaction_time=${new Date().toISOString()}&status_message=Payment Failed`);
      },
      onClose: function() {
        console.log('🚪 Payment popup closed');
        alert('Anda menutup halaman pembayaran sebelum menyelesaikan transaksi.');
      }
    });
  };

  // Payment method categories untuk Midtrans
  const paymentCategories = [
    {
      title: 'E-Wallet',
      icon: <Smartphone className="w-5 h-5" />,
      methods: [
        { id: MIDTRANS_PAYMENT_METHODS.QRIS, label: MIDTRANS_PAYMENT_LABELS[MIDTRANS_PAYMENT_METHODS.QRIS] },
        { id: MIDTRANS_PAYMENT_METHODS.GOPAY, label: MIDTRANS_PAYMENT_LABELS[MIDTRANS_PAYMENT_METHODS.GOPAY] },
        { id: MIDTRANS_PAYMENT_METHODS.DANA, label: MIDTRANS_PAYMENT_LABELS[MIDTRANS_PAYMENT_METHODS.DANA] },
        { id: MIDTRANS_PAYMENT_METHODS.LINKAJA, label: MIDTRANS_PAYMENT_LABELS[MIDTRANS_PAYMENT_METHODS.LINKAJA] },
        { id: MIDTRANS_PAYMENT_METHODS.SHOPEEPAY, label: MIDTRANS_PAYMENT_LABELS[MIDTRANS_PAYMENT_METHODS.SHOPEEPAY] },
      ]
    },
    {
      title: 'Virtual Account',
      icon: <Building className="w-5 h-5" />,
      methods: [
        { id: MIDTRANS_PAYMENT_METHODS.BCA_VA, label: MIDTRANS_PAYMENT_LABELS[MIDTRANS_PAYMENT_METHODS.BCA_VA] },
        { id: MIDTRANS_PAYMENT_METHODS.BRI_VA, label: MIDTRANS_PAYMENT_LABELS[MIDTRANS_PAYMENT_METHODS.BRI_VA] },
        { id: MIDTRANS_PAYMENT_METHODS.BNI_VA, label: MIDTRANS_PAYMENT_LABELS[MIDTRANS_PAYMENT_METHODS.BNI_VA] },
        { id: MIDTRANS_PAYMENT_METHODS.MANDIRI_VA, label: MIDTRANS_PAYMENT_LABELS[MIDTRANS_PAYMENT_METHODS.MANDIRI_VA] },
        { id: MIDTRANS_PAYMENT_METHODS.PERMATA_VA, label: MIDTRANS_PAYMENT_LABELS[MIDTRANS_PAYMENT_METHODS.PERMATA_VA] },
      ]
    },
    {
      title: 'Credit/Debit Card',
      icon: <CreditCard className="w-5 h-5" />,
      methods: [
        { id: MIDTRANS_PAYMENT_METHODS.CREDIT_CARD, label: MIDTRANS_PAYMENT_LABELS[MIDTRANS_PAYMENT_METHODS.CREDIT_CARD] },
      ]
    },
    {
      title: 'Over The Counter',
      icon: <Store className="w-5 h-5" />,
      methods: [
        { id: MIDTRANS_PAYMENT_METHODS.ALFAMART, label: MIDTRANS_PAYMENT_LABELS[MIDTRANS_PAYMENT_METHODS.ALFAMART] },
        { id: MIDTRANS_PAYMENT_METHODS.INDOMARET, label: MIDTRANS_PAYMENT_LABELS[MIDTRANS_PAYMENT_METHODS.INDOMARET] },
        { id: MIDTRANS_PAYMENT_METHODS.AKULAKU, label: MIDTRANS_PAYMENT_LABELS[MIDTRANS_PAYMENT_METHODS.AKULAKU] },
        { id: MIDTRANS_PAYMENT_METHODS.KREDIVO, label: MIDTRANS_PAYMENT_LABELS[MIDTRANS_PAYMENT_METHODS.KREDIVO] },
      ]
    }
  ];

  if (selectedCartItems.length === 0) {
    return null; // Will redirect
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
              <p className="text-gray-600">Lengkapi informasi untuk menyelesaikan pesanan Anda</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Customer Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informasi Pelanggan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nama Lengkap *</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Masukkan nama lengkap"
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Masukkan email"
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Nomor Telepon *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Contoh: 08123456789"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <Label htmlFor="address">Alamat Lengkap *</Label>
                      <Textarea
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Masukkan alamat lengkap"
                        className={errors.address ? 'border-red-500' : ''}
                        rows={3}
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle>Metode Pembayaran</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-semibold text-blue-900">Pembayaran Melalui Midtrans</span>
                        </div>
                        <p className="text-sm text-blue-800 mb-3">
                          Kami menggunakan Midtrans untuk proses pembayaran yang aman dan terpercaya. 
                          Setelah klik "Bayar Sekarang", Anda akan diarahkan ke halaman pembayaran Midtrans 
                          dengan berbagai pilihan metode pembayaran.
                        </p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {/* E-Wallets */}
                          <div className="text-center">
                            <div className="bg-white p-2 rounded border">
                              <Image 
                                src="/images/payment-gateway/gopay.png" 
                                alt="GoPay" 
                                width={40} 
                                height={24}
                                className="mx-auto"
                              />
                            </div>
                            <span className="text-xs text-gray-600 mt-1 block">GoPay</span>
                          </div>
                          
                          <div className="text-center">
                            <div className="bg-white p-2 rounded border">
                              <Image 
                                src="/images/payment-gateway/dana.png" 
                                alt="DANA" 
                                width={40} 
                                height={24}
                                className="mx-auto"
                              />
                            </div>
                            <span className="text-xs text-gray-600 mt-1 block">DANA</span>
                          </div>
                          
                          <div className="text-center">
                            <div className="bg-white p-2 rounded border">
                              <Image 
                                src="/images/payment-gateway/shopee-pay.png" 
                                alt="ShopeePay" 
                                width={40} 
                                height={24}
                                className="mx-auto"
                              />
                            </div>
                            <span className="text-xs text-gray-600 mt-1 block">ShopeePay</span>
                          </div>
                          
                          <div className="text-center">
                            <div className="bg-white p-2 rounded border">
                              <Image 
                                src="/images/payment-gateway/qris.png" 
                                alt="QRIS" 
                                width={40} 
                                height={24}
                                className="mx-auto"
                              />
                            </div>
                            <span className="text-xs text-gray-600 mt-1 block">QRIS</span>
                          </div>
                          
                          {/* Banks */}
                          <div className="text-center">
                            <div className="bg-white p-2 rounded border">
                              <Image 
                                src="/images/payment-gateway/bca.png" 
                                alt="BCA" 
                                width={40} 
                                height={24}
                                className="mx-auto"
                              />
                            </div>
                            <span className="text-xs text-gray-600 mt-1 block">BCA</span>
                          </div>
                          
                          <div className="text-center">
                            <div className="bg-white p-2 rounded border">
                              <Image 
                                src="/images/payment-gateway/mandiri.png" 
                                alt="Mandiri" 
                                width={40} 
                                height={24}
                                className="mx-auto"
                              />
                            </div>
                            <span className="text-xs text-gray-600 mt-1 block">Mandiri</span>
                          </div>
                          
                          <div className="text-center">
                            <div className="bg-white p-2 rounded border">
                              <Image 
                                src="/images/payment-gateway/bni.png" 
                                alt="BNI" 
                                width={40} 
                                height={24}
                                className="mx-auto"
                              />
                            </div>
                            <span className="text-xs text-gray-600 mt-1 block">BNI</span>
                          </div>
                          
                          <div className="text-center">
                            <div className="bg-white p-2 rounded border">
                              <Image 
                                src="/images/payment-gateway/visa.png" 
                                alt="Visa" 
                                width={40} 
                                height={24}
                                className="mx-auto"
                              />
                            </div>
                            <span className="text-xs text-gray-600 mt-1 block">Visa/MC</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-xs text-blue-700">
                          Dan metode pembayaran lainnya tersedia di halaman checkout Midtrans
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Ringkasan Pesanan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedCartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="relative w-12 h-12 bg-white rounded overflow-hidden">
                            <Image
                              src={item.image || '/placeholder-product.png'}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                            <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-green-600">{formatPrice(selectedTotalPrice)}</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Checkout Button */}
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading || selectedCartItems.length === 0}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isLoading ? 'Memproses...' : 'Bayar Sekarang'}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CheckoutPage; 