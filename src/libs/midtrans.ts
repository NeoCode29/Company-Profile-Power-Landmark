import crypto from 'crypto';

// Midtrans Configuration
export const MIDTRANS_CONFIG = {
  CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY || '',
  SERVER_KEY: process.env.MIDTRANS_SERVER_KEY || '',
  MERCHANT_ID: process.env.MIDTRANS_MERCHANT_ID || '',
  IS_SANDBOX: process.env.NODE_ENV !== 'production',
  SANDBOX_BASE_URL: 'https://app.sandbox.midtrans.com',
  PRODUCTION_BASE_URL: 'https://app.midtrans.com',
  SNAP_SANDBOX_URL: 'https://app.sandbox.midtrans.com/snap/snap.js',
  SNAP_PRODUCTION_URL: 'https://app.midtrans.com/snap/snap.js'
};

// Payment Methods yang Didukung Midtrans
export const MIDTRANS_PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer',
  ECHANNEL: 'echannel',
  BCA_VA: 'bca_va',
  BNI_VA: 'bni_va',
  BRI_VA: 'bri_va',
  PERMATA_VA: 'permata_va',
  MANDIRI_VA: 'mandiri_bill',
  GOPAY: 'gopay',
  DANA: 'dana',
  SHOPEEPAY: 'shopeepay',
  LINKAJA: 'linkaja',
  QRIS: 'qris',
  INDOMARET: 'indomaret',
  ALFAMART: 'alfamart',
  AKULAKU: 'akulaku',
  KREDIVO: 'kredivo'
} as const;

// Labels untuk Payment Methods
export const MIDTRANS_PAYMENT_LABELS = {
  [MIDTRANS_PAYMENT_METHODS.CREDIT_CARD]: 'Kartu Kredit/Debit',
  [MIDTRANS_PAYMENT_METHODS.BANK_TRANSFER]: 'Transfer Bank',
  [MIDTRANS_PAYMENT_METHODS.BCA_VA]: 'BCA Virtual Account',
  [MIDTRANS_PAYMENT_METHODS.BNI_VA]: 'BNI Virtual Account',
  [MIDTRANS_PAYMENT_METHODS.BRI_VA]: 'BRI Virtual Account',
  [MIDTRANS_PAYMENT_METHODS.PERMATA_VA]: 'Permata Virtual Account',
  [MIDTRANS_PAYMENT_METHODS.MANDIRI_VA]: 'Mandiri Bill Payment',
  [MIDTRANS_PAYMENT_METHODS.GOPAY]: 'GoPay',
  [MIDTRANS_PAYMENT_METHODS.DANA]: 'DANA',
  [MIDTRANS_PAYMENT_METHODS.SHOPEEPAY]: 'ShopeePay',
  [MIDTRANS_PAYMENT_METHODS.LINKAJA]: 'LinkAja',
  [MIDTRANS_PAYMENT_METHODS.QRIS]: 'QRIS',
  [MIDTRANS_PAYMENT_METHODS.INDOMARET]: 'Indomaret',
  [MIDTRANS_PAYMENT_METHODS.ALFAMART]: 'Alfamart',
  [MIDTRANS_PAYMENT_METHODS.AKULAKU]: 'Akulaku',
  [MIDTRANS_PAYMENT_METHODS.KREDIVO]: 'Kredivo'
};

// Type definitions
export interface MidtransTransactionDetails {
  order_id: string;
  gross_amount: number;
}

export interface MidtransCustomerDetails {
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  billing_address?: MidtransAddress;
  shipping_address?: MidtransAddress;
}

export interface MidtransAddress {
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country_code: string;
}

export interface MidtransItemDetails {
  id: string;
  price: number;
  quantity: number;
  name: string;
  brand?: string;
  category?: string;
  merchant_name?: string;
}

export interface MidtransSnapPayload {
  transaction_details: MidtransTransactionDetails;
  customer_details: MidtransCustomerDetails;
  item_details?: MidtransItemDetails[];
  credit_card?: {
    secure?: boolean;
  };
  enabled_payments?: string[];
  custom_field1?: string;
  custom_field2?: string;
  custom_field3?: string;
}

export interface MidtransSnapResponse {
  token: string;
  redirect_url: string;
}

export interface MidtransNotification {
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  fraud_status?: string;
  currency: string;
  approval_code?: string;
  masked_card?: string;
  eci?: string;
  channel_response_code?: string;
  channel_response_message?: string;
  card_type?: string;
  bank?: string;
  va_numbers?: Array<{
    bank: string;
    va_number: string;
  }>;
  payment_amounts?: Array<{
    paid_at: string;
    amount: string;
  }>;
  bill_key?: string;
  biller_code?: string;
}

// Helper Functions
export function getBaseUrl(): string {
  return MIDTRANS_CONFIG.IS_SANDBOX 
    ? MIDTRANS_CONFIG.SANDBOX_BASE_URL 
    : MIDTRANS_CONFIG.PRODUCTION_BASE_URL;
}

export function getSnapUrl(): string {
  return MIDTRANS_CONFIG.IS_SANDBOX 
    ? MIDTRANS_CONFIG.SNAP_SANDBOX_URL 
    : MIDTRANS_CONFIG.SNAP_PRODUCTION_URL;
}

export function getAuthorizationHeader(): string {
  const serverKey = MIDTRANS_CONFIG.SERVER_KEY;
  return `Basic ${Buffer.from(serverKey + ':').toString('base64')}`;
}

// Generate unique order ID
export function generateOrderId(): string {
  const timestamp = Math.floor(Date.now() / 1000); // Convert to seconds (10 digits)
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `PL-${timestamp}-${random}`;
}

// Create SNAP transaction
export async function createSnapTransaction(payload: MidtransSnapPayload): Promise<MidtransSnapResponse> {
  const url = `${getBaseUrl()}/snap/v1/transactions`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': getAuthorizationHeader(),
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Midtrans API Error: ${response.status} - ${errorData.error_messages || response.statusText}`);
  }

  return response.json();
}

// Verify notification signature
export function verifySignature(notification: MidtransNotification): boolean {
  const orderId = notification.order_id;
  const statusCode = notification.status_code;
  const grossAmount = notification.gross_amount;
  const serverKey = MIDTRANS_CONFIG.SERVER_KEY;
  
  const signatureInput = orderId + statusCode + grossAmount + serverKey;
  const calculatedSignature = crypto.createHash('sha512').update(signatureInput).digest('hex');
  
  return calculatedSignature === notification.signature_key;
}

// Parse transaction status
export function parseTransactionStatus(status: string): {
  status: 'success' | 'pending' | 'failed' | 'cancelled' | 'expired';
  message: string;
} {
  switch (status.toLowerCase()) {
    case 'capture':
    case 'settlement':
      return { status: 'success', message: 'Pembayaran berhasil' };
    
    case 'pending':
      return { status: 'pending', message: 'Menunggu pembayaran' };
    
    case 'deny':
      return { status: 'failed', message: 'Pembayaran ditolak' };
    
    case 'cancel':
      return { status: 'cancelled', message: 'Pembayaran dibatalkan' };
    
    case 'expire':
      return { status: 'expired', message: 'Pembayaran kadaluarsa' };
    
    case 'failure':
      return { status: 'failed', message: 'Pembayaran gagal' };
    
    default:
      return { status: 'pending', message: 'Status tidak dikenal' };
  }
}

// Get payment method category
export function getPaymentMethodCategory(paymentType: string): string {
  const eWallets = ['gopay', 'dana', 'shopeepay', 'linkaja'];
  const virtualAccounts = ['bca_va', 'bni_va', 'bri_va', 'permata_va', 'mandiri_bill'];
  const overTheCounter = ['cstore'];
  const cardlessCredit = ['akulaku', 'kredivo'];

  if (eWallets.includes(paymentType)) return 'E-Wallet';
  if (virtualAccounts.includes(paymentType)) return 'Virtual Account';
  if (overTheCounter.includes(paymentType)) return 'Over The Counter';
  if (cardlessCredit.includes(paymentType)) return 'Cardless Credit';
  if (paymentType === 'credit_card') return 'Credit/Debit Card';
  if (paymentType === 'bank_transfer') return 'Bank Transfer';
  if (paymentType === 'qris') return 'QRIS';
  
  return 'Other';
}

// Format amount for Midtrans (integer)
export function formatAmountForMidtrans(amount: number): number {
  return Math.round(amount);
}

// Test credentials untuk sandbox
export const MIDTRANS_TEST_CREDENTIALS = {
  CARD_NUMBER: '4811111111111114',
  CVV: '123',
  EXP_MONTH: '02',
  EXP_YEAR: '2025',
  OTP: '112233'
};

// Error messages
export const MIDTRANS_ERROR_MESSAGES = {
  INVALID_SIGNATURE: 'Invalid signature from Midtrans notification',
  INVALID_PAYLOAD: 'Invalid transaction payload',
  API_ERROR: 'Midtrans API error occurred',
  NETWORK_ERROR: 'Network error while connecting to Midtrans',
  INVALID_AMOUNT: 'Invalid transaction amount',
  MISSING_CREDENTIALS: 'Missing Midtrans credentials'
};

// Validation functions
export function validateMidtransConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!MIDTRANS_CONFIG.CLIENT_KEY) {
    errors.push('MIDTRANS_CLIENT_KEY is required');
  }

  if (!MIDTRANS_CONFIG.SERVER_KEY) {
    errors.push('MIDTRANS_SERVER_KEY is required');
  }

  if (!MIDTRANS_CONFIG.MERCHANT_ID) {
    errors.push('MIDTRANS_MERCHANT_ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateTransactionPayload(payload: MidtransSnapPayload): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!payload.transaction_details?.order_id) {
    errors.push('Order ID is required');
  }

  if (!payload.transaction_details?.gross_amount || payload.transaction_details.gross_amount <= 0) {
    errors.push('Valid gross amount is required');
  }

  if (!payload.customer_details?.email) {
    errors.push('Customer email is required');
  }

  if (!payload.customer_details?.first_name) {
    errors.push('Customer first name is required');
  }

  if (!payload.customer_details?.phone) {
    errors.push('Customer phone is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
