'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function PaymentFinishContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending' | null>(null)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  const orderNumber = searchParams.get('orderNumber')
  const status = searchParams.get('status')
  const source = searchParams.get('source')
  const transId = searchParams.get('transId')
  const amount = searchParams.get('amount')

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        setIsLoading(true)

        if (!orderNumber) {
          setPaymentStatus('failed')
          setIsLoading(false)
          return
        }

        // Verifikasi status pembayaran dari database atau API
        const response = await fetch(`/api/payment/status?orderNumber=${orderNumber}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          setPaymentStatus(data.status)
          setOrderDetails(data.order)
        } else {
          // Fallback menggunakan status dari URL jika API gagal
          setPaymentStatus(status as 'success' | 'failed' | 'pending' || 'failed')
        }
      } catch (error) {
        console.error('Error processing payment result:', error)
        // Fallback menggunakan status dari URL
        setPaymentStatus(status as 'success' | 'failed' | 'pending' || 'failed')
      } finally {
        setIsLoading(false)
      }
    }

    processPaymentResult()
  }, [orderNumber, status])

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500" />
      case 'pending':
        return <Clock className="w-16 h-16 text-yellow-500" />
      default:
        return <AlertCircle className="w-16 h-16 text-gray-500" />
    }
  }

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Pembayaran Berhasil!'
      case 'failed':
        return 'Pembayaran Gagal'
      case 'pending':
        return 'Pembayaran Tertunda'
      default:
        return 'Status Tidak Diketahui'
    }
  }

  const getStatusDescription = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Terima kasih! Pembayaran Anda telah berhasil diproses. Kami akan segera memproses pesanan Anda.'
      case 'failed':
        return 'Maaf, pembayaran Anda gagal diproses. Silakan coba lagi atau hubungi customer service kami.'
      case 'pending':
        return 'Pembayaran Anda sedang diproses. Kami akan memberitahu Anda setelah pembayaran dikonfirmasi.'
      default:
        return 'Terjadi kesalahan dalam memproses pembayaran. Silakan hubungi customer service kami.'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg">Memproses hasil pembayaran...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <CardTitle className="text-2xl">{getStatusTitle()}</CardTitle>
            <CardDescription className="text-base">
              {getStatusDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderNumber && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm text-gray-600 mb-2">Detail Pesanan</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Nomor Pesanan:</span>
                    <span className="font-mono">{orderNumber}</span>
                  </div>
                  {transId && (
                    <div className="flex justify-between">
                      <span>ID Transaksi:</span>
                      <span className="font-mono">{transId}</span>
                    </div>
                  )}
                  {amount && (
                    <div className="flex justify-between">
                      <span>Jumlah:</span>
                      <span>Rp {Number(amount).toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  {source && (
                    <div className="flex justify-between">
                      <span>Metode:</span>
                      <span className="capitalize">{source}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {paymentStatus === 'success' && (
                <Link href="/products">
                  <Button className="w-full">
                    Lanjut Belanja
                  </Button>
                </Link>
              )}
              
              {paymentStatus === 'failed' && (
                <Button 
                  onClick={() => router.push('/cart')}
                  className="w-full"
                >
                  Coba Lagi
                </Button>
              )}

              <Link href="/">
                <Button variant="outline" className="w-full">
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>

            {paymentStatus === 'failed' && (
              <div className="text-center text-sm text-gray-500">
                <p>Butuh bantuan? Hubungi customer service kami:</p>
                <p>Email: support@powerladmark.com</p>
                <p>WhatsApp: +62 812-3456-7890</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Memuat halaman...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PaymentFinishPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentFinishContent />
    </Suspense>
  )
}
