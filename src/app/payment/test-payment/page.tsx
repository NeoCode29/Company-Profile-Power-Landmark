'use client'

import React, { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CreditCard, Smartphone, QrCode, Building, Store } from 'lucide-react'

const TestPaymentView: React.FC = () => {
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)
  
  const orderNumber = searchParams.get('orderNumber')
  const amount = searchParams.get('amount')
  const transId = searchParams.get('transId')

  const handlePaymentAction = (success: boolean) => {
    setIsProcessing(true)
    
    // Simulate payment processing delay
    setTimeout(() => {
      const baseUrl = window.location.origin
      const status = success ? 'success' : 'failed'
      
      // Redirect to finish page with appropriate status
      window.location.href = `${baseUrl}/payment/finish?test=true&orderNumber=${orderNumber}&amount=${amount}&status=${status}&transId=${transId}`
    }, 2000)
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Payment...</h2>
          <p className="text-gray-600">Please wait while we process your payment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center">
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
              TEST MODE - iPay88 Payment Simulation
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
            <p className="text-gray-600">This is a simulated payment page for development testing</p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium">{transId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-lg text-green-600">
                Rp {parseInt(amount || '0').toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods Simulation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <QrCode className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-medium">QRIS</h3>
                  <p className="text-sm text-gray-500">Scan QR Code to pay</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Smartphone className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-medium">E-Wallet</h3>
                  <p className="text-sm text-gray-500">OVO, DANA, GoPay</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Building className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="font-medium">Virtual Account</h3>
                  <p className="text-sm text-gray-500">Bank Transfer</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-red-600" />
                <div>
                  <h3 className="font-medium">Credit Card</h3>
                  <p className="text-sm text-gray-500">Visa, Mastercard</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Payment Actions</h2>
          <p className="text-gray-600 mb-6">
            In a real environment, you would complete the payment through the selected method. 
            For testing, you can simulate different payment outcomes:
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handlePaymentAction(true)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span>✓</span>
              Simulate Successful Payment
            </button>
            
            <button
              onClick={() => handlePaymentAction(false)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span>✗</span>
              Simulate Failed Payment
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a development simulation. In production, users would be redirected to the actual iPay88 payment gateway.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TestPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <TestPaymentView />
    </Suspense>
  )
}

export default TestPaymentPage 