import React from 'react'
import { handleCodeSubmission } from '../../libs/actions'

export const metadata = {
  title: 'Payment Page',
  description: 'Enter your 6-digit code to proceed with the payment.',
}

async function Page({searchParams} : {searchParams : Promise<{[key : string] : string}>}) {
  const errorMassage = (await searchParams).error
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Enter Code</h2>
        <form action={handleCodeSubmission}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
              6-Digit Code
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="code"
              name="code"
              type="text"
              maxLength={6}
              placeholder="Enter your code"
            />
          {errorMassage && (
            <p className="text-red-500 text-xs italic mt-2">{errorMassage}</p>
          )}
          </div>
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
            >
              Kembali
            </a>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Page
