'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface PaymentResult {
  transaction_status: string;
  order_id: string;
  transaction_id: string;
  payment_type: string;
  gross_amount: string;
  transaction_time: string;
  fraud_status?: string;
  status_message?: string;
  note?: string;
  isOfflineStatus?: boolean;
}

export default function PaymentFinishPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        // Ambil parameter dari URL
        const orderId = searchParams.get('order_id');
        const transactionStatus = searchParams.get('transaction_status');
        const transactionId = searchParams.get('transaction_id');

        if (!orderId) {
          setError('Order ID tidak ditemukan');
          setLoading(false);
          return;
        }

        // Jika ada parameter langsung dari Midtrans
        if (transactionStatus && transactionId) {
          setPaymentResult({
            transaction_status: transactionStatus,
            order_id: orderId,
            transaction_id: transactionId,
            payment_type: searchParams.get('payment_type') || 'unknown',
            gross_amount: searchParams.get('gross_amount') || '0',
            transaction_time: searchParams.get('transaction_time') || new Date().toISOString(),
            fraud_status: searchParams.get('fraud_status') || undefined,
            status_message: searchParams.get('status_message') || undefined,
          });
        } else {
          // Jika tidak ada parameter, fetch dari API
          const response = await fetch(`/api/payment/status?order_id=${orderId}`);
          
          if (!response.ok) {
            throw new Error('Gagal mengambil status pembayaran');
          }

          const data = await response.json();
          
          if (data.success) {
            // Add offline status flag if present
            const paymentData = {
              ...data.payment,
              isOfflineStatus: data.isOfflineStatus || false
            };
            setPaymentResult(paymentData);
          } else {
            setError(data.error || 'Terjadi kesalahan saat mengambil status pembayaran');
          }
        }
      } catch (err) {
        console.error('Error fetching payment status:', err);
        setError('Terjadi kesalahan saat mengambil status pembayaran');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [searchParams]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'capture':
      case 'settlement':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'pending':
        return <Clock className="h-16 w-16 text-yellow-500" />;
      case 'deny':
      case 'cancel':
      case 'expire':
      case 'failure':
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <AlertCircle className="h-16 w-16 text-gray-500" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'capture':
        return {
          title: 'Pembayaran Berhasil!',
          description: 'Transaksi Anda telah berhasil diproses.',
          color: 'text-green-600'
        };
      case 'settlement':
        return {
          title: 'Pembayaran Selesai!',
          description: 'Transaksi Anda telah diselesaikan.',
          color: 'text-green-600'
        };
      case 'pending':
        return {
          title: 'Pembayaran Menunggu',
          description: 'Silakan selesaikan pembayaran Anda.',
          color: 'text-yellow-600'
        };
      case 'deny':
        return {
          title: 'Pembayaran Ditolak',
          description: 'Transaksi Anda ditolak oleh sistem.',
          color: 'text-red-600'
        };
      case 'cancel':
        return {
          title: 'Pembayaran Dibatalkan',
          description: 'Transaksi Anda telah dibatalkan.',
          color: 'text-red-600'
        };
      case 'expire':
        return {
          title: 'Pembayaran Kadaluarsa',
          description: 'Waktu pembayaran telah habis.',
          color: 'text-red-600'
        };
      case 'failure':
        return {
          title: 'Pembayaran Gagal',
          description: 'Terjadi kegagalan dalam memproses pembayaran.',
          color: 'text-red-600'
        };
      default:
        return {
          title: 'Status Tidak Dikenal',
          description: 'Status pembayaran tidak dapat diidentifikasi.',
          color: 'text-gray-600'
        };
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(parseInt(amount));
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Mengambil status pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push('/')} className="w-full">
              Kembali ke Beranda
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paymentResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <CardTitle className="text-gray-600">Data Tidak Ditemukan</CardTitle>
            <CardDescription>Informasi pembayaran tidak dapat ditemukan.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push('/')} className="w-full">
              Kembali ke Beranda
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusMessage(paymentResult.transaction_status);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 pt-32">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon(paymentResult.transaction_status)}
          </div>
          <CardTitle className={`text-2xl font-bold ${statusInfo.color}`}>
            {statusInfo.title}
          </CardTitle>
          <CardDescription className="text-lg">
            {statusInfo.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Detail Transaksi */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Detail Transaksi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order ID:</p>
                <p className="font-medium text-gray-900">{paymentResult.order_id}</p>
              </div>
              <div>
                <p className="text-gray-600">Transaction ID:</p>
                <p className="font-medium text-gray-900">{paymentResult.transaction_id}</p>
              </div>
              <div>
                <p className="text-gray-600">Metode Pembayaran:</p>
                <p className="font-medium text-gray-900 capitalize">
                  {paymentResult.payment_type.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Jumlah:</p>
                <p className="font-medium text-gray-900">
                  {formatCurrency(paymentResult.gross_amount)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Waktu Transaksi:</p>
                <p className="font-medium text-gray-900">
                  {formatDateTime(paymentResult.transaction_time)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Status:</p>
                <p className={`font-medium capitalize ${statusInfo.color}`}>
                  {paymentResult.transaction_status}
                </p>
              </div>
            </div>
          </div>

          {/* Fraud Status (jika ada) */}
          {paymentResult.fraud_status && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Status Fraud</h3>
              <p className="text-blue-800 capitalize">{paymentResult.fraud_status}</p>
            </div>
          )}

          {/* Status Message (jika ada) */}
          {paymentResult.status_message && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Pesan Status</h3>
              <p className="text-gray-800">{paymentResult.status_message}</p>
            </div>
          )}

          {/* Offline Status Note (jika ada) */}
          {paymentResult.isOfflineStatus && paymentResult.note && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">Informasi Status</h3>
                  <p className="text-amber-800 text-sm">{paymentResult.note}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => router.push('/')} 
              className="flex-1"
              variant="outline"
            >
              Kembali ke Beranda
            </Button>
            
            {(paymentResult.transaction_status === 'capture' || 
              paymentResult.transaction_status === 'settlement') && (
              <Button 
                onClick={() => router.push('/products')} 
                className="flex-1"
              >
                Lanjut Berbelanja
              </Button>
            )}
            
            {paymentResult.transaction_status === 'pending' && (
              <Button 
                onClick={() => window.location.reload()} 
                className="flex-1"
              >
                Cek Status Lagi
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}