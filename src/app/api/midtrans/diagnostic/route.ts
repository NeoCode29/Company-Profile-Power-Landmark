import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizationHeader, getBaseUrl } from '@/libs/midtrans';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.action === 'environment_check') {
      const authHeader = getAuthorizationHeader();
      const baseUrl = getBaseUrl();
      
      const diagnostic = {
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        midtrans: {
          serverKey: process.env.MIDTRANS_SERVER_KEY ? 'SET' : 'NOT SET',
          clientKey: process.env.MIDTRANS_CLIENT_KEY ? 'SET' : 'NOT SET',
          merchantId: process.env.MIDTRANS_MERCHANT_ID ? 'SET' : 'NOT SET',
          baseUrl: baseUrl,
          dashboardUrl: process.env.NODE_ENV === 'production'
            ? 'https://dashboard.midtrans.com'
            : 'https://dashboard.sandbox.midtrans.com'
        },
        headers: {
          authorization: authHeader ? 'SET (Basic Authentication)' : 'NOT SET',
          contentType: 'application/json',
          accept: 'application/json',
          example: {
            'Authorization': authHeader ? `${authHeader.substring(0, 20)}...` : 'NOT SET',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        },
        api: {
          statusEndpoint: `${baseUrl}/v2/{order_id}/status`,
          snapEndpoint: `${baseUrl}/snap/v1/transactions`,
          method: 'GET for status, POST for create token'
        },
        orderIdFormat: 'PL-[timestamp]-[random]',
        expectedFormat: 'PL-1234567890-ABCDE',
        troubleshooting: {
          steps: [
            '1. Periksa apakah Order ID benar',
            '2. Pastikan environment sesuai (sandbox/production)',
            '3. Cek dashboard Midtrans untuk transaksi',
            '4. Periksa apakah checkout process berhasil',
            '5. Verifikasi credentials Midtrans'
          ]
        }
      };
      
      return NextResponse.json(diagnostic);
    }
    
    if (body.action === 'test_headers') {
      const authHeader = getAuthorizationHeader();
      const baseUrl = getBaseUrl();
      
      // Test headers dengan order ID dummy
      const testOrderId = 'TEST-HEADERS-123';
      const testUrl = `${baseUrl}/v2/${testOrderId}/status`;
      
      const testHeaders = {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      try {
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: testHeaders
        });
        
        return NextResponse.json({
          test: 'headers_validation',
          url: testUrl,
          headers: {
            'Authorization': `${authHeader.substring(0, 20)}...`,
            'Accept': testHeaders['Accept'],
            'Content-Type': testHeaders['Content-Type']
          },
          response: {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
          },
          result: response.status === 404 ? 'HEADERS_OK (404 expected for test ID)' : 
                  response.status === 401 ? 'AUTH_ERROR (Check credentials)' : 
                  response.status === 200 ? 'UNEXPECTED_SUCCESS' : 
                  `HTTP_${response.status}`
        });
      } catch (error) {
        return NextResponse.json({
          test: 'headers_validation',
          error: error instanceof Error ? error.message : 'Unknown error',
          headers: testHeaders
        });
      }
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    
  } catch (error) {
    console.error('Diagnostic error:', error);
    return NextResponse.json({ error: 'Diagnostic failed' }, { status: 500 });
  }
}

export async function GET() {
  const info = {
    message: 'Midtrans Diagnostic Endpoint',
    description: 'POST with action: environment_check or test_headers for diagnostic information',
    actions: [
      'environment_check - Check environment and credentials',
      'test_headers - Test headers with Midtrans API'
    ],
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  };
  
  return NextResponse.json(info);
} 