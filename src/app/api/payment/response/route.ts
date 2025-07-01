import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// iPay88 Configuration
const IPAY88_CONFIG = {
  MERCHANT_CODE: process.env.IPAY88_MERCHANT_CODE || 'ID00001',
  MERCHANT_KEY: process.env.IPAY88_MERCHANT_KEY || 'your-merchant-key'
};

// Verify signature helper (callback/response) dengan delimiter ||  
function verifySignature(params: {
  MerchantCode: string;
  PaymentId: string;
  RefNo: string;
  Amount: string;
  Currency: string;
  Status: string; // "1" or "0"
  Signature: string;
}): boolean {
  const { MerchantCode, PaymentId, RefNo, Amount, Currency, Status, Signature } = params;
  const signatureString = `||${IPAY88_CONFIG.MERCHANT_KEY}||${MerchantCode}||${PaymentId}||${RefNo}||${Amount}||${Currency}||${Status}||`;
  const expected = crypto.createHash('sha256').update(signatureString).digest('hex');
  return expected.toLowerCase() === (Signature || '').toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 iPay88 Response URL POST called');
    
    // Handle CORS untuk iPay88 sandbox
    const origin = request.headers.get('origin');
    console.log('Request origin:', origin);
    
    const contentType = request.headers.get('content-type') || '';
    let parsed: any = {};

    if (contentType.includes('application/json')) {
      parsed = await request.json();
    } else {
      // Assume form-urlencoded / multipart
      const formData = await request.formData();
      formData.forEach((value, key) => {
        parsed[key] = value;
      });
    }

    const {
      MerchantCode = '',
      RefNo = '',
      TransId = '',
      Amount = '',
      Status = '',
      PaymentId = '',
      Signature = '',
      Currency = 'IDR'
    } = parsed;

    console.log('🔎 Parsed iPay88 Response:', {
      MerchantCode,
      RefNo,
      TransId,
      Amount,
      Status,
      PaymentId,
      Signature: Signature ? '***PROVIDED***' : '***MISSING***'
    });

    // Optional: verify signature when provided
    if (Signature && MerchantCode && MerchantCode !== 'ID00000') {
      const isValid = verifySignature({
        MerchantCode,
        PaymentId,
        RefNo,
        Amount,
        Currency,
        Status,
        Signature
      });
      console.log('Signature valid:', isValid);
    }

    // Create redirect URL to payment status page  
    const baseUrl = 'http://localhost:3000'; // Force localhost untuk testing
    const redirectUrl = new URL('/payment/status', baseUrl);
    redirectUrl.searchParams.set('orderNumber', RefNo);
    redirectUrl.searchParams.set('status', Status === '1' ? 'success' : 'failed');
    redirectUrl.searchParams.set('source', 'ipay88');
    redirectUrl.searchParams.set('transId', TransId || '');
    redirectUrl.searchParams.set('amount', Amount || '');

    const htmlResponse = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Payment Response</title>
        <meta charset="utf-8">
    </head>
    <body>
        <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
            <h2>Processing payment response...</h2>
            <p>Please wait while we redirect you.</p>
            <script>
                setTimeout(function() {
                    window.top.location.href = "${redirectUrl.toString()}";
                }, 500);
            </script>
        </div>
    </body>
    </html>`;

    return new NextResponse(htmlResponse, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('❌ Error handling iPay88 response:', error);
    
    // Return error HTML
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const redirectUrl = new URL('/payment/finish', baseUrl);
    redirectUrl.searchParams.set('status', 'failed');
    redirectUrl.searchParams.set('error', 'processing_error');

    const htmlResponse = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Payment Error</title>
        <meta charset="utf-8">
    </head>
    <body>
        <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
            <h2>Payment processing error</h2>
            <p>Redirecting to finish page...</p>
            <script>
                setTimeout(function() {
                    window.top.location.href = "${redirectUrl.toString()}";
                }, 1000);
            </script>
        </div>
    </body>
    </html>`;

    return new NextResponse(htmlResponse, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'SAMEORIGIN',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
}

export async function GET(request: NextRequest) {
  // Handle GET requests (redirect from iPay88)
  const { searchParams } = new URL(request.url);
  
  console.log('🔄 iPay88 Response URL GET called with params:', Object.fromEntries(searchParams.entries()));
  
  // Extract parameters from iPay88 response
  const merchantCode = searchParams.get('MerchantCode');
  const refNo = searchParams.get('RefNo') || searchParams.get('orderNumber');
  const status = searchParams.get('Status') || searchParams.get('status');
  const transId = searchParams.get('TransId') || searchParams.get('transId');
  const amount = searchParams.get('Amount') || searchParams.get('amount');
  const paymentId = searchParams.get('PaymentId');
  const signature = searchParams.get('Signature');
  const currency = searchParams.get('Currency') || 'IDR';
  
  if (signature && paymentId) {
    const isValid = verifySignature({
      MerchantCode: merchantCode || '',
      PaymentId: paymentId,
      RefNo: refNo || '',
      Amount: amount || '',
      Currency: currency,
      Status: status || '',
      Signature: signature
    });
    console.log('Signature valid (GET):', isValid);
  }
  
  console.log('Extracted GET parameters:', {
    MerchantCode: merchantCode,
    RefNo: refNo,
    Status: status,
    TransId: transId,
    Amount: amount,
    PaymentId: paymentId,
    Signature: signature ? '***PROVIDED***' : '***MISSING***'
  });
  
  // Determine final status
  let finalStatus = 'failed';
  if (status === '1' || status === 'success') {
    finalStatus = 'success';
  } else if (status === '0' || status === 'failed') {
    finalStatus = 'failed';
  }
  
      // Create redirect URL to payment status page (untuk testing di localhost)
    const baseUrl = 'http://localhost:3000'; // Force localhost untuk testing
    const redirectUrl = new URL('/payment/status', baseUrl);
  redirectUrl.searchParams.set('orderNumber', refNo || '');
  redirectUrl.searchParams.set('status', finalStatus);
  redirectUrl.searchParams.set('source', 'ipay88');
  redirectUrl.searchParams.set('transId', transId || '');
  redirectUrl.searchParams.set('amount', amount || '');
  
  console.log('🔗 Redirecting to:', redirectUrl.toString());
  
  // Return HTML redirect instead of NextResponse.redirect to avoid CORS issues
  const htmlResponse = `
  <!DOCTYPE html>
  <html>
  <head>
      <title>Payment Response</title>
      <meta charset="utf-8">
  </head>
  <body>
      <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
          <h2>Processing payment response...</h2>
          <p>Status: ${finalStatus}</p>
          <p>Order: ${refNo || 'Unknown'}</p>
          <p>Please wait while we redirect you.</p>
          <script>
              console.log('Redirecting to:', "${redirectUrl.toString()}");
              setTimeout(function() {
                  window.location.href = "${redirectUrl.toString()}";
              }, 1000);
          </script>
      </div>
  </body>
  </html>`;

  return new NextResponse(htmlResponse, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
} 