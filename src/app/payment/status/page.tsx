'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, AlertCircle, Search, Shield, RefreshCw, CreditCard, Building, AlertTriangle, Wifi, WifiOff, Database } from 'lucide-react';

interface RefundDetail {
  refund_chargeback_id: number;
  refund_chargeback_uuid: string;
  refund_amount: string;
  created_at: string;
  reason: string;
  refund_key: string;
  refund_method: string;
  bank_confirmed_at: string;
}

interface PaymentStatus {
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
  currency?: string;
  merchant_id?: string;
  // Enhanced fields
  refunds?: RefundDetail[];
  refund_amount?: string;
  has_refund?: boolean;
  va_numbers?: any[];
  payment_amounts?: any[];
  masked_card?: string;
  bank?: string;
  card_type?: string;
}

interface ApiResponse {
  success: boolean;
  payment: PaymentStatus;
  order?: any;
  isOfflineStatus?: boolean;
  dataSource?: string;
  lastUpdated?: string;
  error?: string;
}

export default function PaymentStatusPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const handleCheckStatus = async (showLoading = true) => {
    if (!orderId.trim()) {
      setError('Silakan masukkan Order ID');
      return;
    }

    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      console.log(`🔍 Checking payment status for order: ${orderId}`);
      console.log(`📡 API Call: GET /api/payment/status?order_id=${orderId}`);
      
      const response = await fetch(`/api/payment/status?order_id=${orderId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log(`📊 API Response Status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP ${response.status}: Gagal mengambil status pembayaran`);
      }

      const data: ApiResponse = await response.json();
      console.log(`✅ API Response Data:`, data);
      
      if (data.success) {
        // Enhanced logging for database status
        console.group(`🔍 DETAILED STATUS ANALYSIS`);
        console.log(`📄 Order ID: ${orderId}`);
        console.log(`🎯 Transaction Status: "${data.payment.transaction_status}"`);
        console.log(`📊 Status Message Title: "${getStatusMessage(data.payment.transaction_status).title}"`);
        console.log(`💾 Data Source: DATABASE (Sistem Internal)`);
        console.log(`⏰ Transaction Time: ${data.payment.transaction_time}`);
        console.log(`💰 Amount: ${data.payment.gross_amount}`);
        console.log(`🔒 Fraud Status: ${data.payment.fraud_status || 'N/A'}`);
        console.log(`📅 Last Updated: ${data.lastUpdated || 'N/A'}`);
        
        // Special logging for settlement status
        if (data.payment.transaction_status === 'settlement') {
          console.log(`🎉 SETTLEMENT DETECTED!`);
          console.log(`✅ Payment should show as "Pembayaran Selesai"`);
          console.log(`💾 Status dari database sistem (ter-update via webhook)`);
        }
        
        // Check for pending status
        if (data.payment.transaction_status === 'pending') {
          console.log(`⏳ Status PENDING dari database`);
          console.log(`💡 Status akan ter-update otomatis via webhook Midtrans`);
        }
        
        console.groupEnd();

        // Log source of data
        console.log(`📄 Data Source: Database (Sistem lokal)`);
        console.log(`📊 Data Source Type: ${data.dataSource || 'database'}`);
        console.log(`⏰ Last Updated: ${data.lastUpdated || 'N/A'}`);
        

        setApiResponse(data);
        setPaymentStatus(data.payment);
        setLastChecked(new Date());

        // Additional validation for settlement
        if (data.payment.transaction_status === 'settlement') {
          console.log(`🎊 Settlement confirmed! Status should show: "Pembayaran Selesai"`);
        }
        
      } else {
        setError(data.error || 'Status pembayaran tidak ditemukan');
        console.error(`❌ API Error Response:`, data);
      }
    } catch (err) {
      console.error('❌ Error checking payment status:', err);
      setError(`Terjadi kesalahan: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Auto-refresh for pending transactions
  const handleAutoRefresh = () => {
    if (paymentStatus && 
        (paymentStatus.transaction_status === 'pending' || 
         paymentStatus.transaction_status === 'authorize')) {
      console.log('🔄 Auto-refreshing pending transaction...');
      handleCheckStatus(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'capture':
      case 'settlement':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'authorize':
        return <Shield className="h-12 w-12 text-blue-500" />;
      case 'pending':
        return <Clock className="h-12 w-12 text-yellow-500" />;
      case 'deny':
      case 'cancel':
      case 'expire':
      case 'failure':
        return <XCircle className="h-12 w-12 text-red-500" />;
      case 'refund':
      case 'partial_refund':
        return <RefreshCw className="h-12 w-12 text-orange-500" />;
      default:
        return <AlertCircle className="h-12 w-12 text-gray-500" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'capture':
        return {
          title: 'Pembayaran Berhasil',
          description: 'Transaksi telah berhasil diproses dan dana telah dikunci.',
          color: 'text-green-600'
        };
      case 'settlement':
        return {
          title: 'Pembayaran Selesai',
          description: 'Transaksi telah diselesaikan dan dana telah masuk ke akun.',
          color: 'text-green-600'
        };
      case 'authorize':
        return {
          title: 'Otorisasi Berhasil',
          description: 'Dana telah diotorisasi dan dapat di-capture dalam 7 hari.',
          color: 'text-blue-600'
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
          description: 'Transaksi ditolak oleh sistem keamanan atau bank.',
          color: 'text-red-600'
        };
      case 'cancel':
        return {
          title: 'Pembayaran Dibatalkan',
          description: 'Transaksi telah dibatalkan.',
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
      case 'refund':
        return {
          title: 'Pembayaran Di-refund',
          description: 'Transaksi telah di-refund penuh.',
          color: 'text-orange-600'
        };
      case 'partial_refund':
        return {
          title: 'Pembayaran Di-refund Sebagian',
          description: 'Transaksi telah di-refund sebagian.',
          color: 'text-orange-600'
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-32">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cek Status Pembayaran</h1>
          <p className="text-gray-600">Masukkan Order ID untuk mengecek status pembayaran dari database sistem</p>
        </div>

        {/* Data Source Info */}
        {paymentStatus && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-700">Data dari Database Lokal</p>
                    <p className="text-sm text-blue-600">Status ter-update berdasarkan data sistem internal</p>
                  </div>
                </div>
                {lastChecked && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Terakhir dicek:</p>
                    <p className="text-sm font-medium">{formatDateTime(lastChecked.toISOString())}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Input Order ID */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Cek Status Pembayaran
            </CardTitle>
            <CardDescription>
              Masukkan Order ID untuk mengecek status pembayaran dari database sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  type="text"
                  placeholder="Contoh: PL-1234567890-ABCD"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="mt-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCheckStatus();
                    }
                  }}
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-red-600 text-sm font-medium">Gagal mengambil status:</p>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction Not Found Error */}
              {error && error.includes('Transaction not found') && (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-semibold text-orange-900 mb-2">🔍 Transaksi Tidak Ditemukan di Midtrans</h3>
                      <p className="text-orange-800 text-sm mb-3">
                        Order ID "<strong>{orderId}</strong>" tidak ditemukan di server Midtrans. 
                        Ini bisa disebabkan oleh beberapa hal:
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="bg-white p-3 rounded border border-orange-200">
                          <h4 className="font-medium text-orange-900 mb-1">🎯 Kemungkinan Penyebab:</h4>
                          <ul className="text-sm text-orange-800 space-y-1">
                            <li>• <strong>Order ID salah:</strong> Periksa kembali penulisan Order ID</li>
                            <li>• <strong>Transaksi belum dibuat:</strong> Proses checkout mungkin gagal</li>
                            <li>• <strong>Environment mismatch:</strong> Sandbox vs Production</li>
                            <li>• <strong>Transaksi expired:</strong> Sudah terlalu lama dan terhapus</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button 
                          onClick={() => {
                            console.log('🔍 CHECKING ORDER IN DATABASE...');
                            // Try to get order info from database
                            fetch(`/api/admin/orders?search=${orderId}`)
                              .then(res => res.json())
                              .then(data => {
                                console.log('📊 Database order info:', data);
                                if (data.orders && data.orders.length > 0) {
                                  const order = data.orders[0];
                                  alert(`Order ditemukan di database:\n- Status: ${order.status}\n- Payment: ${order.paymentStatus}\n- Created: ${order.createdAt}\n- Amount: ${order.totalAmount}`);
                                } else {
                                  alert('Order tidak ditemukan di database lokal');
                                }
                              })
                              .catch(err => {
                                console.error('Database check error:', err);
                                alert('Gagal mengecek database');
                              });
                          }}
                          size="sm"
                          variant="outline"
                          className="border-orange-300 text-orange-700 hover:bg-orange-100"
                        >
                          📊 Cek Database
                        </Button>
                        
                        <Button 
                          onClick={() => window.open('https://dashboard.midtrans.com/transactions', '_blank')}
                          size="sm"
                          variant="outline"
                          className="border-orange-300 text-orange-700 hover:bg-orange-100"
                        >
                          🌐 Buka Dashboard Midtrans
                        </Button>
                        
                        <Button 
                          onClick={() => {
                            const newOrderId = prompt('Masukkan Order ID yang benar:', orderId);
                            if (newOrderId && newOrderId.trim()) {
                              setOrderId(newOrderId.trim());
                              setError(null);
                              setPaymentStatus(null);
                              setApiResponse(null);
                            }
                          }}
                          size="sm"
                          variant="outline"
                          className="border-orange-300 text-orange-700 hover:bg-orange-100"
                        >
                          ✏️ Koreksi Order ID
                        </Button>
                        
                        {/* Environment Diagnostic */}
                        <Button 
                          onClick={async () => {
                            console.log('🔍 RUNNING ENVIRONMENT DIAGNOSTIC...');
                            try {
                              const response = await fetch('/api/midtrans/diagnostic', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'environment_check' })
                              });
                              
                              if (response.ok) {
                                const data = await response.json();
                                console.log('🔧 Environment diagnostic:', data);
                                
                                const info = [
                                  `Environment: ${data.environment}`,
                                  `Midtrans Base URL: ${data.midtrans.baseUrl}`,
                                  `Client Key: ${data.midtrans.clientKey}`,
                                  `Server Key: ${data.midtrans.serverKey}`,
                                  `Authorization: ${data.headers.authorization}`,
                                  `Headers: Accept & Content-Type = application/json`
                                ].join('\n');
                                
                                alert(`Environment & Headers Info:\n\n${info}`);
                              } else {
                                // Fallback if diagnostic endpoint doesn't exist
                                const info = [
                                  `Current Environment: ${process.env.NODE_ENV || 'development'}`,
                                  `Order ID: ${orderId}`,
                                  `Expected Format: PL-[timestamp]-[random]`,
                                  `Check: Dashboard Midtrans untuk memastikan transaksi ada`
                                ].join('\n');
                                
                                alert(`Basic Environment Check:\n\n${info}`);
                              }
                            } catch (error) {
                              console.error('Diagnostic error:', error);
                              alert('Gagal menjalankan diagnostic. Periksa console untuk detail.');
                            }
                          }}
                          size="sm"
                          variant="outline"
                          className="border-orange-300 text-orange-700 hover:bg-orange-100"
                        >
                          🔧 Diagnostic
                        </Button>
                        
                        {/* Test Headers Button */}
                        <Button 
                          onClick={async () => {
                            console.log('🔍 TESTING HEADERS WITH MIDTRANS API...');
                            try {
                              const response = await fetch('/api/midtrans/diagnostic', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'test_headers' })
                              });
                              
                              if (response.ok) {
                                const data = await response.json();
                                console.log('🔧 Headers test result:', data);
                                
                                const info = [
                                  `Test URL: ${data.url}`,
                                  `Authorization: ${data.headers.Authorization}`,
                                  `Accept: ${data.headers.Accept}`,
                                  `Content-Type: ${data.headers['Content-Type']}`,
                                  `Response Status: ${data.response.status}`,
                                  `Result: ${data.result}`,
                                  ``,
                                  `✅ Headers sudah benar jika result = HEADERS_OK`,
                                  `❌ Jika AUTH_ERROR = periksa credentials`
                                ].join('\n');
                                
                                alert(`Headers Test Result:\n\n${info}`);
                              } else {
                                throw new Error('Headers test failed');
                              }
                            } catch (error) {
                              console.error('Headers test error:', error);
                              alert('Gagal test headers. Periksa console untuk detail.');
                            }
                          }}
                          size="sm"
                          variant="outline"
                          className="border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                          🔍 Test Headers
                        </Button>
                        
                        {/* Deep Debug Button */}
                        <Button 
                          onClick={async () => {
                            if (!orderId.trim()) {
                              alert('Masukkan Order ID terlebih dahulu');
                              return;
                            }
                            
                            console.log(`🔬 RUNNING DEEP DEBUG ANALYSIS FOR: ${orderId}`);
                            try {
                              const response = await fetch('/api/midtrans/debug', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ orderId: orderId.trim() })
                              });
                              
                              if (response.ok) {
                                const data = await response.json();
                                console.group('🔬 DEEP DEBUG ANALYSIS RESULTS');
                                console.log('📋 Full Analysis:', data);
                                console.log('🎯 Order ID:', data.debug.orderId);
                                console.log('📊 Format Analysis:', data.debug.analysis.format);
                                console.log('🗄️ Database Status:', data.debug.analysis.database);
                                console.log('🌐 Midtrans API Test:', data.debug.analysis.midtrans);
                                console.log('🔧 Checkout Analysis:', data.debug.analysis.checkout);
                                console.log('💡 Recommendations:', data.debug.recommendations);
                                console.groupEnd();
                                
                                // Create summary for user
                                const summary = [
                                  `🔬 DEEP DEBUG ANALYSIS`,
                                  ``,
                                  `📄 Order ID: ${data.debug.orderId}`,
                                  ``,
                                  `📊 FORMAT ANALYSIS:`,
                                  `✓ Prefix: ${data.debug.analysis.format.prefix}`,
                                  `✓ Timestamp: ${data.debug.analysis.format.timestamp} (${data.debug.analysis.format.timestamp.length} digits)`,
                                  `✓ Random: ${data.debug.analysis.format.random}`,
                                  `${data.debug.analysis.format.issues.length > 0 ? '⚠️ Issues: ' + data.debug.analysis.format.issues.join(', ') : '✅ Format OK'}`,
                                  ``,
                                  `🗄️ DATABASE STATUS:`,
                                  `${data.debug.analysis.database.found ? '✅ Found' : '❌ Not Found'}`,
                                  data.debug.analysis.database.found ? `Status: ${data.debug.analysis.database.status}/${data.debug.analysis.database.paymentStatus}` : '',
                                  data.debug.analysis.database.found ? `Token: ${data.debug.analysis.checkout.tokenCreated ? 'Created' : 'Missing'}` : '',
                                  ``,
                                  `🌐 MIDTRANS API:`,
                                  `${data.debug.analysis.midtrans.found ? '✅ Found' : '❌ Not Found'}`,
                                  `Status: HTTP ${data.debug.analysis.midtrans.status}`,
                                  data.debug.analysis.midtrans.error ? `Error: ${data.debug.analysis.midtrans.error}` : '',
                                  ``,
                                  `💡 RECOMMENDATIONS:`,
                                  ...data.debug.recommendations.map((rec: string, i: number) => `${i + 1}. ${rec}`)
                                ].filter(line => line !== '').join('\n');
                                
                                alert(summary);
                              } else {
                                throw new Error('Debug analysis failed');
                              }
                            } catch (error) {
                              console.error('🔬 Deep debug error:', error);
                              alert('Gagal menjalankan deep debug. Periksa console untuk detail.');
                            }
                          }}
                          size="sm"
                          variant="outline"
                          className="border-purple-300 text-purple-700 hover:bg-purple-100"
                        >
                          🔬 Deep Debug
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleCheckStatus()}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Mengecek dari Database...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Cek Status Pembayaran
                    </>
                  )}
                </Button>
                
                {paymentStatus && (
                  <Button 
                    onClick={handleAutoRefresh}
                    variant="outline"
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}

                {/* Force Refresh Button for Settlement Issues */}
                {paymentStatus && (
                  <Button 
                    onClick={async () => {
                      console.log('🔄 FORCE REFRESH - Clearing cache and getting fresh data...');
                      setPaymentStatus(null);
                      setApiResponse(null);
                      setLastChecked(null);
                      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
                      handleCheckStatus();
                    }}
                    variant="outline"
                    disabled={loading}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    title="Force refresh dengan clear cache"
                  >
                    🔄 Force
                  </Button>
                )}

                {/* Direct Midtrans API Call for Debugging */}
                {process.env.NODE_ENV === 'development' && orderId && (
                  <Button 
                    onClick={async () => {
                      console.log('🐛 DIRECT API TEST - Bypassing cache...');
                      try {
                        const directResponse = await fetch(`/api/payment/status?order_id=${orderId}&_t=${Date.now()}`, {
                          cache: 'no-cache',
                          headers: {
                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                            'Pragma': 'no-cache'
                          }
                        });
                        const directData = await directResponse.json();
                        console.log('🐛 DIRECT API RESULT:', directData);
                        alert(`Direct API Status: ${directData.payment?.transaction_status || 'ERROR'}\nSource: ${directData.isOfflineStatus ? 'DATABASE' : 'MIDTRANS'}`);
                      } catch (error) {
                        console.error('🐛 Direct API Error:', error);
                        alert('Direct API call failed - check console');
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    🐛 Debug
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {paymentStatus && (
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {getStatusIcon(paymentStatus.transaction_status)}
              </div>
              <CardTitle className={`text-xl font-bold ${getStatusMessage(paymentStatus.transaction_status).color}`}>
                {getStatusMessage(paymentStatus.transaction_status).title}
              </CardTitle>
              <CardDescription className="text-base">
                {getStatusMessage(paymentStatus.transaction_status).description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Fraud Alert */}
              {paymentStatus.fraud_status === 'deny' && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-semibold text-red-900 mb-1">⚠️ Peringatan Keamanan</h3>
                      <p className="text-red-800 text-sm">
                        Transaksi ini ditandai sebagai fraud oleh sistem keamanan Midtrans. 
                        Hubungi customer service untuk bantuan lebih lanjut.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* API Source Warning */}
              {apiResponse?.isOfflineStatus && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <div className="flex items-start">
                    <WifiOff className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-1">📄 Data dari Database Lokal</h3>
                      <p className="text-amber-800 text-sm">
                        Status ini diambil dari database karena Midtrans API sedang tidak tersedia. 
                        Untuk status terbaru, coba refresh beberapa saat lagi.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Debug Information - Show in development */}
              {process.env.NODE_ENV === 'development' && paymentStatus && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    🐛 Debug Information
                  </h3>
                  <div className="text-xs font-mono bg-white p-3 rounded border overflow-x-auto">
                    <div className="space-y-2">
                      <div>
                        <span className="text-blue-600">Raw transaction_status:</span>
                        <span className="ml-2 text-red-600 font-bold">"{paymentStatus.transaction_status}"</span>
                      </div>
                      <div>
                        <span className="text-blue-600">Status title shown:</span>
                        <span className="ml-2 text-green-600 font-bold">"{getStatusMessage(paymentStatus.transaction_status).title}"</span>
                      </div>
                      <div>
                        <span className="text-blue-600">Data source:</span>
                        <span className="ml-2 text-purple-600 font-bold">{apiResponse?.isOfflineStatus ? "DATABASE" : "MIDTRANS_API"}</span>
                      </div>
                      <div>
                        <span className="text-blue-600">API Response:</span>
                        <pre className="mt-1 text-xs">{JSON.stringify(apiResponse, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Database Status Info */}
              {paymentStatus && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Database className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">💾 Status dari Database Sistem</h3>
                      <p className="text-blue-800 text-sm mb-2">
                        Status pembayaran "<strong>{paymentStatus.transaction_status}</strong>" diambil dari database internal sistem.
                        Data ini ter-update secara otomatis melalui webhook dari Midtrans.
                      </p>
                      <div className="text-xs text-blue-700 bg-blue-100 rounded p-2 mt-2">
                        <strong>Info:</strong> Status akan ter-update otomatis ketika terjadi perubahan pembayaran melalui webhook Midtrans.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Detail Transaksi */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Detail Transaksi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Order ID:</p>
                    <p className="font-medium text-gray-900 font-mono">{paymentStatus.order_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Transaction ID:</p>
                    <p className="font-medium text-gray-900 font-mono">{paymentStatus.transaction_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Metode Pembayaran:</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {paymentStatus.payment_type.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Jumlah:</p>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(paymentStatus.gross_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Waktu Transaksi:</p>
                    <p className="font-medium text-gray-900">
                      {formatDateTime(paymentStatus.transaction_time)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status:</p>
                    <Badge variant={
                      paymentStatus.transaction_status === 'capture' || paymentStatus.transaction_status === 'settlement' ? 'default' :
                      paymentStatus.transaction_status === 'pending' || paymentStatus.transaction_status === 'authorize' ? 'secondary' :
                      'destructive'
                    }>
                      {paymentStatus.transaction_status}
                    </Badge>
                  </div>
                  {paymentStatus.currency && (
                    <div>
                      <p className="text-gray-600">Mata Uang:</p>
                      <p className="font-medium text-gray-900">{paymentStatus.currency}</p>
                    </div>
                  )}
                  {paymentStatus.merchant_id && (
                    <div>
                      <p className="text-gray-600">Merchant ID:</p>
                      <p className="font-medium text-gray-900 font-mono">{paymentStatus.merchant_id}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Details */}
              {(paymentStatus.masked_card || paymentStatus.va_numbers) && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Detail Metode Pembayaran
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {paymentStatus.masked_card && (
                      <>
                        <div>
                          <p className="text-blue-600">Nomor Kartu:</p>
                          <p className="font-medium text-blue-900 font-mono">{paymentStatus.masked_card}</p>
                        </div>
                        <div>
                          <p className="text-blue-600">Jenis Kartu:</p>
                          <p className="font-medium text-blue-900 capitalize">{paymentStatus.card_type}</p>
                        </div>
                        <div>
                          <p className="text-blue-600">Bank:</p>
                          <p className="font-medium text-blue-900 uppercase">{paymentStatus.bank}</p>
                        </div>
                      </>
                    )}
                    {paymentStatus.va_numbers && paymentStatus.va_numbers.length > 0 && (
                      <div className="md:col-span-2">
                        <p className="text-blue-600 mb-2">Virtual Account Numbers:</p>
                        <div className="space-y-2">
                          {paymentStatus.va_numbers.map((va, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-900 font-mono">{va.bank}: {va.va_number}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Refund Details */}
              {paymentStatus.has_refund && paymentStatus.refunds && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Detail Refund
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-orange-600">Total Refund:</p>
                      <p className="font-bold text-orange-900 text-lg">
                        {formatCurrency(paymentStatus.refund_amount || '0')}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-orange-600 font-medium">Riwayat Refund:</p>
                      {paymentStatus.refunds.map((refund, index) => (
                        <div key={refund.refund_chargeback_id} className="bg-white p-3 rounded border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-600">Jumlah Refund:</p>
                              <p className="font-medium text-gray-900">{formatCurrency(refund.refund_amount)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Tanggal:</p>
                              <p className="font-medium text-gray-900">{formatDateTime(refund.created_at)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Metode:</p>
                              <p className="font-medium text-gray-900 capitalize">{refund.refund_method}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Status:</p>
                              <Badge variant="outline">
                                {refund.bank_confirmed_at ? 'Dikonfirmasi' : 'Pending'}
                              </Badge>
                            </div>
                            {refund.reason && (
                              <div className="md:col-span-2">
                                <p className="text-gray-600">Alasan:</p>
                                <p className="font-medium text-gray-900">{refund.reason}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Fraud Status */}
              {paymentStatus.fraud_status && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Status Keamanan Midtrans
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={paymentStatus.fraud_status === 'accept' ? 'default' : 'destructive'}>
                      {paymentStatus.fraud_status === 'accept' ? 'Aman' : 'Fraud'}
                    </Badge>
                    <span className="text-blue-800 text-sm">
                      {paymentStatus.fraud_status === 'accept' 
                        ? 'Transaksi dianggap aman oleh sistem keamanan Midtrans'
                        : 'Transaksi ditandai sebagai fraud oleh sistem keamanan Midtrans'
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* Status Message */}
              {paymentStatus.status_message && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Pesan dari Midtrans</h3>
                  <p className="text-gray-800">{paymentStatus.status_message}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => {
                    setPaymentStatus(null);
                    setApiResponse(null);
                    setOrderId('');
                    setLastChecked(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cek Order Lain
                </Button>
                
                {(paymentStatus.transaction_status === 'capture' || 
                  paymentStatus.transaction_status === 'settlement') && (
                  <Button 
                    onClick={() => router.push('/products')} 
                    className="flex-1"
                  >
                    Lanjut Berbelanja
                  </Button>
                )}
                
                {(paymentStatus.transaction_status === 'pending' || 
                  paymentStatus.transaction_status === 'authorize') && (
                  <Button 
                    onClick={() => handleCheckStatus()}
                    className="flex-1"
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh dari Midtrans
                  </Button>
                )}
              </div>

              {/* Help Section */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Butuh Bantuan?</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Jika Anda mengalami masalah dengan pembayaran atau ada perbedaan status, 
                  silakan hubungi customer service kami:
                </p>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>📧 Email: support@powerladmark.com</p>
                  <p>📱 WhatsApp: +62 812-3456-7890</p>
                  <p>⏰ Jam Operasional: 08:00 - 17:00 WIB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Information Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Tentang Status Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  Data Real-time dari Midtrans
                </h4>
                <p className="text-sm text-green-700">
                  Status diambil langsung dari server Midtrans untuk memastikan akurasi dan real-time updates.
                </p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-600">Berhasil (Capture/Settlement)</p>
                    <p className="text-gray-600">Pembayaran berhasil diproses dan dana telah diterima</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-600">Otorisasi (Authorize)</p>
                    <p className="text-gray-600">Dana telah diotorisasi dan dapat di-capture dalam 7 hari</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-yellow-600">Menunggu (Pending)</p>
                    <p className="text-gray-600">Pembayaran sedang diproses atau menunggu konfirmasi</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-orange-600">Refund</p>
                    <p className="text-gray-600">Pembayaran telah dikembalikan (penuh atau sebagian)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-600">Gagal/Ditolak</p>
                    <p className="text-gray-600">Pembayaran tidak berhasil atau ditolak sistem</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 