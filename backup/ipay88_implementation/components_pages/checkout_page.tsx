'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import { formatPrice } from '@/lib/utils';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '@/lib/ipay88';
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
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(PAYMENT_METHODS.QRIS);
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
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedCartItems,
          customerInfo: customerInfo,
          paymentMethod: selectedPaymentMethod,
          totalAmount: selectedTotalPrice,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Untuk API 2.0, jika ada checkoutId, redirect ke iPay88 payment gateway
        if (result.checkoutId && result.signature) {
          console.log('🔗 Preparing redirect to iPay88');
          console.log('🔗 Payment URL:', result.paymentUrl);
          console.log('🔗 CheckoutID:', result.checkoutId);
          
          // Simple redirect tanpa kompleksitas iframe
          // iPay88 akan menerima referrer dari localhost:3000
          console.log('🚀 Redirecting to iPay88 payment gateway');
          window.location.href = result.paymentUrl;
          
        } else {
          // Fallback untuk test mode atau redirect langsung
          console.log('🔗 Fallback redirect:', result.paymentUrl);
          window.location.href = result.paymentUrl;
        }
      } else {
        throw new Error(result.error || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Terjadi kesalahan saat memproses checkout. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Payment method categories
  const paymentCategories = [
    {
      title: 'E-Wallet',
      icon: <Smartphone className="w-5 h-5" />,
      methods: [
        { id: PAYMENT_METHODS.QRIS, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.QRIS] },
        { id: PAYMENT_METHODS.OVO, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.OVO] },
        { id: PAYMENT_METHODS.DANA, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.DANA] },
        { id: PAYMENT_METHODS.LINKAJA, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.LINKAJA] },
        { id: PAYMENT_METHODS.SHOPEEPAY, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.SHOPEEPAY] },
      ]
    },
    {
      title: 'Virtual Account',
      icon: <Building className="w-5 h-5" />,
      methods: [
        { id: PAYMENT_METHODS.BCA_VA, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.BCA_VA] },
        { id: PAYMENT_METHODS.BRI_VA, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.BRI_VA] },
        { id: PAYMENT_METHODS.BNI_VA, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.BNI_VA] },
        { id: PAYMENT_METHODS.MANDIRI_VA, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.MANDIRI_VA] },
        { id: PAYMENT_METHODS.PERMATA_VA, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.PERMATA_VA] },
      ]
    },
    {
      title: 'Credit Card',
      icon: <CreditCard className="w-5 h-5" />,
      methods: [
        { id: PAYMENT_METHODS.BCA_CREDIT, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.BCA_CREDIT] },
        { id: PAYMENT_METHODS.BRI_CREDIT, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.BRI_CREDIT] },
        { id: PAYMENT_METHODS.CIMB_CREDIT, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.CIMB_CREDIT] },
        { id: PAYMENT_METHODS.UNIONPAY, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.UNIONPAY] },
      ]
    },
    {
      title: 'Over The Counter',
      icon: <Store className="w-5 h-5" />,
      methods: [
        { id: PAYMENT_METHODS.ALFAMART, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.ALFAMART] },
        { id: PAYMENT_METHODS.INDOMARET, label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.INDOMARET] },
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
                    <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      {paymentCategories.map((category) => (
                        <div key={category.title} className="space-y-3">
                          <div className="flex items-center gap-2 font-medium text-gray-700">
                            {category.icon}
                            <span>{category.title}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-7">
                            {category.methods.map((method) => (
                              <div key={method.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={method.id} id={method.id} />
                                <Label htmlFor={method.id} className="cursor-pointer">
                                  {method.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <Separator className="mt-4" />
                        </div>
                      ))}
                    </RadioGroup>
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