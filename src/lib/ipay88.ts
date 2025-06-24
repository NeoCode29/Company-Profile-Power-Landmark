import crypto from 'crypto';

// iPay88 Configuration
export const IPAY88_CONFIG = {
  MERCHANT_CODE: process.env.IPAY88_MERCHANT_CODE || 'ID00001',
  MERCHANT_KEY: process.env.IPAY88_MERCHANT_KEY || 'your-merchant-key',
  SANDBOX_URL: 'https://sandbox.ipay88.co.id/ePayment/WebService/PaymentAPI/Checkout',
  PRODUCTION_URL: 'https://payment.ipay88.co.id/ePayment/WebService/PaymentAPI/Checkout',
  REQUERY_SANDBOX_URL: 'https://sandbox.ipay88.co.id/ePayment/WebService/PaymentAPI/RequeryPaymentStatus',
  REQUERY_PRODUCTION_URL: 'https://payment.ipay88.co.id/ePayment/WebService/PaymentAPI/RequeryPaymentStatus',
  IS_SANDBOX: process.env.NODE_ENV !== 'production'
};

// Payment Methods
export const PAYMENT_METHODS = {
  // E-Wallet
  OVO: '63',
  DANA: '77',
  LINKAJA: '13',
  SHOPEEPAY: '76',
  
  // QRIS
  QRIS: '120',
  QRIS_STATIC: '141',
  
  // Virtual Account
  BCA_VA: '140',
  BRI_VA: '118',
  BNI_VA: '83',
  MANDIRI_VA: '119',
  PERMATA_VA: '112',
  CIMB_VA: '135',
  DANAMON_VA: '111',
  MAYBANK_VA: '9',
  
  // Credit/Debit Card
  BCA_CREDIT: '101',
  BRI_CREDIT: '105',
  CIMB_CREDIT: '103',
  UNIONPAY: '54',
  
  // Over The Counter
  ALFAMART: '60',
  INDOMARET: '65',
  
  // Online Credit
  AKULAKU: '71',
  INDODANA: '70',
  KREDIVO: '55',
  ATOME: '73'
} as const;

// Payment Method Labels
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.OVO]: 'OVO',
  [PAYMENT_METHODS.DANA]: 'DANA',
  [PAYMENT_METHODS.LINKAJA]: 'LinkAja',
  [PAYMENT_METHODS.SHOPEEPAY]: 'ShopeePay',
  [PAYMENT_METHODS.QRIS]: 'QRIS',
  [PAYMENT_METHODS.QRIS_STATIC]: 'QRIS Static',
  [PAYMENT_METHODS.BCA_VA]: 'BCA Virtual Account',
  [PAYMENT_METHODS.BRI_VA]: 'BRI Virtual Account',
  [PAYMENT_METHODS.BNI_VA]: 'BNI Virtual Account',
  [PAYMENT_METHODS.MANDIRI_VA]: 'Mandiri Virtual Account',
  [PAYMENT_METHODS.PERMATA_VA]: 'Permata Virtual Account',
  [PAYMENT_METHODS.CIMB_VA]: 'CIMB Virtual Account',
  [PAYMENT_METHODS.BCA_CREDIT]: 'BCA Credit Card',
  [PAYMENT_METHODS.BRI_CREDIT]: 'BRI Credit Card',
  [PAYMENT_METHODS.CIMB_CREDIT]: 'CIMB Credit Card',
  [PAYMENT_METHODS.UNIONPAY]: 'UnionPay',
  [PAYMENT_METHODS.ALFAMART]: 'Alfamart',
  [PAYMENT_METHODS.INDOMARET]: 'Indomaret',
  [PAYMENT_METHODS.AKULAKU]: 'Akulaku',
  [PAYMENT_METHODS.KREDIVO]: 'Kredivo'
};

// Generate SHA256 signature for checkout
export function generateCheckoutSignature(params: {
  MerchantCode: string;
  PaymentId: string;
  RefNo: string;
  Amount: string;
  Currency: string;
  ProdDesc: string;
  UserName: string;
  UserEmail: string;
  UserContact: string;
  Remark: string;
  Lang: string;
  ResponseURL: string;
  BackendURL: string;
}): string {
  const {
    MerchantCode,
    PaymentId,
    RefNo,
    Amount,
    Currency,
    ProdDesc,
    UserName,
    UserEmail,
    UserContact,
    Remark,
    Lang,
    ResponseURL,
    BackendURL
  } = params;

  const signatureString = `${IPAY88_CONFIG.MERCHANT_KEY}${MerchantCode}${PaymentId}${RefNo}${Amount}${Currency}${ProdDesc}${UserName}${UserEmail}${UserContact}${Remark}${Lang}${ResponseURL}${BackendURL}`;
  
  return crypto.createHash('sha256').update(signatureString).digest('hex');
}

// Generate signature for callback verification
export function generateCallbackSignature(params: {
  MerchantCode: string;
  PaymentId: string;
  RefNo: string;
  Amount: string;
  Currency: string;
  Status: string;
}): string {
  const { MerchantCode, PaymentId, RefNo, Amount, Currency, Status } = params;
  const signatureString = `${IPAY88_CONFIG.MERCHANT_KEY}${MerchantCode}${PaymentId}${RefNo}${Amount}${Currency}${Status}`;
  
  return crypto.createHash('sha256').update(signatureString).digest('hex');
}

// Generate signature for requery
export function generateRequerySignature(params: {
  MerchantCode: string;
  RefNo: string;
  Amount: string;
}): string {
  const { MerchantCode, RefNo, Amount } = params;
  const signatureString = `${IPAY88_CONFIG.MERCHANT_KEY}${MerchantCode}${RefNo}${Amount}`;
  
  return crypto.createHash('sha256').update(signatureString).digest('hex');
}

// Verify callback signature
export function verifyCallbackSignature(params: {
  MerchantCode: string;
  PaymentId: string;
  RefNo: string;
  Amount: string;
  Currency: string;
  Status: string;
  Signature: string;
}): boolean {
  const expectedSignature = generateCallbackSignature(params);
  return expectedSignature.toLowerCase() === params.Signature.toLowerCase();
}

// Get payment method category
export function getPaymentMethodCategory(paymentId: string): string {
  const eWallets = [PAYMENT_METHODS.OVO, PAYMENT_METHODS.DANA, PAYMENT_METHODS.LINKAJA, PAYMENT_METHODS.SHOPEEPAY];
  const qris = [PAYMENT_METHODS.QRIS, PAYMENT_METHODS.QRIS_STATIC];
  const virtualAccounts = [
    PAYMENT_METHODS.BCA_VA, PAYMENT_METHODS.BRI_VA, PAYMENT_METHODS.BNI_VA,
    PAYMENT_METHODS.MANDIRI_VA, PAYMENT_METHODS.PERMATA_VA, PAYMENT_METHODS.CIMB_VA
  ];
  const creditCards = [PAYMENT_METHODS.BCA_CREDIT, PAYMENT_METHODS.BRI_CREDIT, PAYMENT_METHODS.CIMB_CREDIT, PAYMENT_METHODS.UNIONPAY];
  const otc = [PAYMENT_METHODS.ALFAMART, PAYMENT_METHODS.INDOMARET];
  const onlineCredit = [PAYMENT_METHODS.AKULAKU, PAYMENT_METHODS.KREDIVO];

  if (eWallets.includes(paymentId as any)) return 'E-Wallet';
  if (qris.includes(paymentId as any)) return 'QRIS';
  if (virtualAccounts.includes(paymentId as any)) return 'Virtual Account';
  if (creditCards.includes(paymentId as any)) return 'Credit Card';
  if (otc.includes(paymentId as any)) return 'Over The Counter';
  if (onlineCredit.includes(paymentId as any)) return 'Online Credit';
  
  return 'Other';
}

// Format amount for iPay88 (remove decimal points)
export function formatAmountForIPay88(amount: number): string {
  return Math.round(amount).toString();
}

// Generate unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `PL${timestamp}${random}`;
}

// iPay88 API Response types
export interface IPay88CheckoutResponse {
  Status: string;
  Message: string;
  Data?: {
    MerchantCode: string;
    PaymentId: string;
    RefNo: string;
    Amount: string;
    Currency: string;
    TransId: string;
    PaymentURL?: string;
  };
  ErrDesc?: string;
}

export interface IPay88CallbackData {
  MerchantCode: string;
  PaymentId: string;
  RefNo: string;
  Amount: string;
  Currency: string;
  Remark: string;
  TransId: string;
  AuthCode: string;
  Status: string;
  ErrDesc: string;
  Signature: string;
  PaymentDate: string;
}

export interface IPay88RequeryResponse {
  Status: string;
  Message: string;
  Data?: {
    MerchantCode: string;
    PaymentId: string;
    RefNo: string;
    Amount: string;
    Currency: string;
    TransId: string;
    AuthCode: string;
    TransactionStatus: string;
    ErrDesc: string;
    PaymentDate: string;
  };
} 