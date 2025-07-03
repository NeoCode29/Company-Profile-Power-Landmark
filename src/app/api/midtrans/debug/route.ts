import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthorizationHeader, getBaseUrl } from '@/libs/midtrans';

interface OrderDebugInfo {
  orderId: string;
  analysis: {
    format: {
      isValid: boolean;
      prefix: string;
      timestamp: string;
      random: string;
      issues: string[];
    };
    database: {
      found: boolean;
      status?: string;
      paymentStatus?: string;
      createdAt?: string;
      totalAmount?: number;
      paymentToken?: string;
    };
    midtrans: {
      tested: boolean;
      status?: number;
      found?: boolean;
      error?: string;
    };
    checkout: {
      tokenCreated: boolean;
      timestampValid: boolean;
      possibleIssues: string[];
    };
  };
  recommendations: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const debugInfo: OrderDebugInfo = {
      orderId,
      analysis: {
        format: {
          isValid: false,
          prefix: '',
          timestamp: '',
          random: '',
          issues: []
        },
        database: {
          found: false
        },
        midtrans: {
          tested: false
        },
        checkout: {
          tokenCreated: false,
          timestampValid: false,
          possibleIssues: []
        }
      },
      recommendations: []
    };

    // 1. Analyze Order ID Format
    console.log(`🔍 ANALYZING ORDER ID: ${orderId}`);
    
    const orderIdPattern = /^PL-(\d+)-([A-Z0-9]+)$/;
    const match = orderId.match(orderIdPattern);
    
    if (match) {
      const [, timestamp, random] = match;
      
      debugInfo.analysis.format = {
        isValid: true,
        prefix: 'PL-',
        timestamp: timestamp,
        random: random,
        issues: []
      };
      
      // Check timestamp format
      if (timestamp.length === 13) {
        debugInfo.analysis.format.issues.push('Timestamp is 13 digits (milliseconds) - should be 10 digits');
        debugInfo.analysis.checkout.timestampValid = false;
      } else if (timestamp.length === 10) {
        debugInfo.analysis.checkout.timestampValid = true;
      } else {
        debugInfo.analysis.format.issues.push(`Timestamp length ${timestamp.length} is invalid`);
      }
      
      // Check random part
      if (random.length < 5) {
        debugInfo.analysis.format.issues.push('Random part too short');
      }
    } else {
      debugInfo.analysis.format.issues.push('Order ID format invalid - should be PL-[timestamp]-[random]');
    }

    // 2. Check Database
    console.log('🔍 CHECKING DATABASE...');
    
    try {
      const order = await prisma.order.findUnique({
        where: { orderNumber: orderId },
        include: {
          items: {
            include: {
              product: true,
              service: true
            }
          }
        }
      });
      
      if (order) {
        debugInfo.analysis.database = {
          found: true,
          status: order.status,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt.toISOString(),
          totalAmount: order.totalAmount,
          paymentToken: order.paymentToken || undefined
        };
        
        // Check if payment token exists
        if (order.paymentToken) {
          debugInfo.analysis.checkout.tokenCreated = true;
        } else {
          debugInfo.analysis.checkout.possibleIssues.push('Payment token not found in database');
        }
      } else {
        debugInfo.analysis.database.found = false;
        debugInfo.analysis.checkout.possibleIssues.push('Order not found in database');
      }
    } catch (error) {
      debugInfo.analysis.checkout.possibleIssues.push(`Database error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }

    // 3. Test Midtrans API
    console.log('🔍 TESTING MIDTRANS API...');
    
    try {
      const baseUrl = getBaseUrl();
      const authHeader = getAuthorizationHeader();
      const statusUrl = `${baseUrl}/v2/${orderId}/status`;
      
      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      debugInfo.analysis.midtrans = {
        tested: true,
        status: response.status,
        found: response.ok
      };
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        debugInfo.analysis.midtrans.error = errorData.error_messages || response.statusText;
      }
    } catch (error) {
      debugInfo.analysis.midtrans = {
        tested: true,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }

    // 4. Generate Recommendations
    console.log('🔍 GENERATING RECOMMENDATIONS...');
    
    if (!debugInfo.analysis.format.isValid) {
      debugInfo.recommendations.push('🔧 Fix Order ID format - should be PL-[10digit-timestamp]-[5-6char-random]');
    }
    
    if (debugInfo.analysis.format.issues.length > 0) {
      debugInfo.recommendations.push(`⚠️ Format issues: ${debugInfo.analysis.format.issues.join(', ')}`);
    }
    
    if (!debugInfo.analysis.database.found) {
      debugInfo.recommendations.push('🔍 Order not found in database - check if checkout process completed');
    }
    
    if (debugInfo.analysis.database.found && !debugInfo.analysis.checkout.tokenCreated) {
      debugInfo.recommendations.push('🎯 Payment token missing - checkout process likely failed at token creation');
    }
    
    if (debugInfo.analysis.midtrans.tested && !debugInfo.analysis.midtrans.found) {
      if (debugInfo.analysis.midtrans.status === 404) {
        debugInfo.recommendations.push('❌ Transaction not found in Midtrans - order was never created in payment gateway');
      } else if (debugInfo.analysis.midtrans.status === 401) {
        debugInfo.recommendations.push('🔐 Authentication error - check Midtrans credentials');
      } else {
        debugInfo.recommendations.push(`🚨 API error: HTTP ${debugInfo.analysis.midtrans.status}`);
      }
    }
    
    if (debugInfo.analysis.checkout.timestampValid && debugInfo.analysis.database.found && !debugInfo.analysis.midtrans.found) {
      debugInfo.recommendations.push('🔄 Recreate transaction - order exists in database but not in Midtrans');
    }
    
    if (!debugInfo.analysis.checkout.timestampValid) {
      debugInfo.recommendations.push('⏰ Fix timestamp generation - use Date.now() instead of Date.now().toString()');
    }

    // 5. Additional Debug Info
    const additionalInfo = {
      environment: process.env.NODE_ENV || 'development',
      midtransBaseUrl: getBaseUrl(),
      currentTimestamp: Date.now(),
      currentTimestampLength: Date.now().toString().length,
      authHeaderSet: !!getAuthorizationHeader(),
      databaseConnection: 'OK'
    };

    console.log('✅ DEBUG ANALYSIS COMPLETE');
    
    return NextResponse.json({
      success: true,
      debug: debugInfo,
      additional: additionalInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Debug analysis error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Debug analysis failed'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Midtrans Debug Endpoint',
    description: 'POST with { "orderId": "PL-xxx" } to analyze order issues',
    usage: {
      method: 'POST',
      body: { orderId: 'PL-1751522082588-T5BGQ9' },
      response: 'Comprehensive debug analysis'
    }
  });
} 