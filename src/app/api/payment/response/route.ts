import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 iPay88 Response URL called');
    
    // Handle CORS untuk iPay88 sandbox
    const origin = request.headers.get('origin');
    console.log('Request origin:', origin);
    
    const formData = await request.formData();
    const merchantCode = formData.get('MerchantCode') as string;
    const refNo = formData.get('RefNo') as string;
    const transId = formData.get('TransId') as string;
    const amount = formData.get('Amount') as string;
    const status = formData.get('Status') as string;
    const paymentId = formData.get('PaymentId') as string;
    
    console.log('iPay88 Response URL data:', {
      MerchantCode: merchantCode,
      RefNo: refNo,
      TransId: transId,
      Amount: amount,
      Status: status,
      PaymentId: paymentId
    });

    // Create HTML response that redirects to finish page
    // Ini menghindari Server Actions issue
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const redirectUrl = new URL('/payment/finish', baseUrl);
    redirectUrl.searchParams.set('orderNumber', refNo);
    redirectUrl.searchParams.set('status', status === '1' ? 'success' : 'failed');
    redirectUrl.searchParams.set('source', 'ipay88');
    redirectUrl.searchParams.set('transId', transId || '');
    redirectUrl.searchParams.set('amount', amount || '');

    // Return HTML response with JavaScript redirect untuk menghindari CORS issue
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
  
  // Extract parameters
  const refNo = searchParams.get('RefNo') || searchParams.get('orderNumber');
  const status = searchParams.get('Status') || searchParams.get('status');
  const transId = searchParams.get('TransId') || searchParams.get('transId');
  const amount = searchParams.get('Amount') || searchParams.get('amount');
  
  // Create redirect URL
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const redirectUrl = new URL('/payment/finish', baseUrl);
  redirectUrl.searchParams.set('orderNumber', refNo || '');
  redirectUrl.searchParams.set('status', status === '1' ? 'success' : 'failed');
  redirectUrl.searchParams.set('source', 'ipay88');
  redirectUrl.searchParams.set('transId', transId || '');
  redirectUrl.searchParams.set('amount', amount || '');
  
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
          <p>Please wait while we redirect you.</p>
          <script>
              window.location.href = "${redirectUrl.toString()}";
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

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 