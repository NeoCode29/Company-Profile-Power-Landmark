'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5'

const TransactionStatusView: React.FC = () => {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const statusCode = searchParams.get('status_code')
  const transactionStatus = searchParams.get('transaction_status')

  // Kondisi sukses: status_code 200 dan transaction_status settlement
  const isSuccess = statusCode === '200' && transactionStatus === 'settlement'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <IoCheckmarkCircleOutline className="text-green-500" size={64} />
          ) : (
            <IoCloseCircleOutline className="text-red-500" size={64} />
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {isSuccess ? 'Payment Successful' : 'Payment Failed'}
        </h1>
        <p className="text-gray-600 mb-4">
          {isSuccess
            ? 'Your transaction has been successfully settled.'
            : 'There was an error processing your transaction.'}
        </p>
        <div className="bg-gray-100 rounded p-4 text-left">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Order ID:</span> {orderId}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Status Code:</span> {statusCode}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Transaction Status:</span> {transactionStatus}
          </p>
        </div>
        <button
          onClick={() => (window.location.href = '/')}
          className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors"
        >
          Go Back Home
        </button>
      </div>
    </div>
    
  )
}

function PaymentFinishPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <TransactionStatusView />
    </Suspense>
  )
}


export default PaymentFinishPage
