'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Play, CheckCircle, AlertCircle } from 'lucide-react';

export default function PaymentTestPage() {
  const router = useRouter();
  const [testOrderId, setTestOrderId] = useState('TEST-' + Date.now());
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const testUrls = {
    finishSuccess: `/payment/finish?order_id=${testOrderId}&transaction_status=capture&transaction_id=test-${Date.now()}&payment_type=credit_card&gross_amount=100000&transaction_time=${new Date().toISOString()}&fraud_status=accept&status_message=Success`,
    finishPending: `/payment/finish?order_id=${testOrderId}&transaction_status=pending&transaction_id=test-${Date.now()}&payment_type=bank_transfer&gross_amount=100000&transaction_time=${new Date().toISOString()}&status_message=Pending`,
    finishFailed: `/payment/finish?order_id=${testOrderId}&transaction_status=failure&transaction_id=test-${Date.now()}&payment_type=credit_card&gross_amount=100000&transaction_time=${new Date().toISOString()}&status_message=Failed`,
    statusCheck: `/payment/status`,
    apiStatus: `/api/payment/status?order_id=${testOrderId}`,
    webhook: `/api/midtrans/webhook`
  };

  const webhookTestData = {
    transaction_time: new Date().toISOString(),
    transaction_status: "capture",
    transaction_id: "test-" + Date.now(),
    status_message: "midtrans payment notification",
    status_code: "200",
    signature_key: "test-signature-key",
    payment_type: "credit_card",
    order_id: testOrderId,
    merchant_id: "G123456789",
    gross_amount: "100000.00",
    fraud_status: "accept",
    currency: "IDR",
    approval_code: "123456",
    masked_card: "481111-1114",
    card_type: "credit",
    bank: "bni"
  };

  const handleTestCheckout = async () => {
    const testData = {
      items: [
        {
          id: 'test-product-1',
          name: 'Test Product 1',
          price: 50000,
          quantity: 1
        },
        {
          id: 'test-product-2',
          name: 'Test Product 2',
          price: 50000,
          quantity: 1
        }
      ],
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '08123456789',
        address: 'Jakarta'
      },
      totalAmount: 100000
    };

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const result = await response.json();
      console.log('Checkout result:', result);
      
      if (result.success) {
        alert(`Checkout berhasil! Order ID: ${result.orderId}`);
        setTestOrderId(result.orderId);
      } else {
        alert('Checkout gagal: ' + result.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Terjadi kesalahan saat checkout');
    }
  };

  const handleTestWebhook = async () => {
    try {
      const response = await fetch('/api/midtrans/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookTestData),
      });

      const result = await response.json();
      console.log('Webhook result:', result);
      
      if (response.ok) {
        alert('Webhook test berhasil!');
      } else {
        alert('Webhook test gagal: ' + result.error);
      }
    } catch (error) {
      console.error('Webhook error:', error);
      alert('Terjadi kesalahan saat test webhook');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Testing Dashboard</h1>
          <p className="text-gray-600">Test semua fitur payment dan status checking Midtrans</p>
        </div>

        <Tabs defaultValue="urls" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="urls">Test URLs</TabsTrigger>
            <TabsTrigger value="api">API Testing</TabsTrigger>
            <TabsTrigger value="webhook">Webhook Test</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          {/* Test URLs Tab */}
          <TabsContent value="urls" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Order ID</CardTitle>
                <CardDescription>Order ID yang digunakan untuk testing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    value={testOrderId}
                    onChange={(e) => setTestOrderId(e.target.value)}
                    placeholder="Test Order ID"
                  />
                  <Button onClick={() => setTestOrderId('TEST-' + Date.now())}>
                    Generate New
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Finish Payment URLs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Finish Payment - Success</CardTitle>
                  <CardDescription>Test halaman finish payment dengan status berhasil</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-mono text-green-800 break-all">
                      {window.location.origin + testUrls.finishSuccess}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(testUrls.finishSuccess, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(window.location.origin + testUrls.finishSuccess, 'success')}
                    >
                      {copied === 'success' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-yellow-600">Finish Payment - Pending</CardTitle>
                  <CardDescription>Test halaman finish payment dengan status pending</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm font-mono text-yellow-800 break-all">
                      {window.location.origin + testUrls.finishPending}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(testUrls.finishPending, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(window.location.origin + testUrls.finishPending, 'pending')}
                    >
                      {copied === 'pending' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Finish Payment - Failed</CardTitle>
                  <CardDescription>Test halaman finish payment dengan status gagal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm font-mono text-red-800 break-all">
                      {window.location.origin + testUrls.finishFailed}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(testUrls.finishFailed, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(window.location.origin + testUrls.finishFailed, 'failed')}
                    >
                      {copied === 'failed' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">Status Check</CardTitle>
                  <CardDescription>Test halaman cek status pembayaran</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-mono text-blue-800 break-all">
                      {window.location.origin + testUrls.statusCheck}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(testUrls.statusCheck, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(window.location.origin + testUrls.statusCheck, 'status')}
                    >
                      {copied === 'status' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API Testing Tab */}
          <TabsContent value="api" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Checkout API</CardTitle>
                  <CardDescription>Test API endpoint untuk checkout</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleTestCheckout} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Test Checkout
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Test Status API</CardTitle>
                  <CardDescription>Test API endpoint untuk cek status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-mono text-gray-800 break-all">
                      GET {window.location.origin + testUrls.apiStatus}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(testUrls.apiStatus, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(window.location.origin + testUrls.apiStatus, 'api')}
                    >
                      {copied === 'api' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Webhook Test Tab */}
          <TabsContent value="webhook" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Webhook</CardTitle>
                <CardDescription>Test webhook notification dari Midtrans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Webhook URL:</p>
                  <p className="text-sm font-mono text-gray-600 break-all">
                    POST {window.location.origin + testUrls.webhook}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Test Data:</p>
                  <pre className="text-xs text-gray-600 overflow-auto">
                    {JSON.stringify(webhookTestData, null, 2)}
                  </pre>
                </div>

                <Button onClick={handleTestWebhook} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Test Webhook
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Midtrans Dashboard URLs</CardTitle>
                <CardDescription>URL yang perlu dikonfigurasi di Midtrans Dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold">Finish URL</Label>
                    <div className="bg-green-50 p-3 rounded-lg mt-1">
                      <p className="text-sm font-mono text-green-800 break-all">
                        {window.location.origin}/payment/finish
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-semibold">Notification URL</Label>
                    <div className="bg-blue-50 p-3 rounded-lg mt-1">
                      <p className="text-sm font-mono text-blue-800 break-all">
                        {window.location.origin}/api/midtrans/webhook
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-semibold">Unfinish URL</Label>
                    <div className="bg-yellow-50 p-3 rounded-lg mt-1">
                      <p className="text-sm font-mono text-yellow-800 break-all">
                        {window.location.origin}/payment/finish
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-semibold">Error URL</Label>
                    <div className="bg-red-50 p-3 rounded-lg mt-1">
                      <p className="text-sm font-mono text-red-800 break-all">
                        {window.location.origin}/payment/finish
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>Variabel environment yang diperlukan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-800">
{`# Midtrans Configuration
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxx"
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxx"
MIDTRANS_MERCHANT_ID="G123456789"

# Database
DATABASE_URL="your-database-url"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Integrasi</CardTitle>
                <CardDescription>Checklist fitur yang sudah terintegrasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Halaman Finish Payment</span>
                    <Badge variant="secondary">✅ Ready</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Halaman Status Check</span>
                    <Badge variant="secondary">✅ Ready</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">API Payment Status</span>
                    <Badge variant="secondary">✅ Ready</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Webhook Handler</span>
                    <Badge variant="secondary">✅ Ready</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Checkout Integration</span>
                    <Badge variant="secondary">✅ Ready</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 