# iPay88 Payment Gateway Setup

## Environment Variables

Tambahkan konfigurasi berikut ke file `.env.local`:

```env
# iPay88 Payment Gateway Configuration
IPAY88_MERCHANT_CODE="ID00001"
IPAY88_MERCHANT_KEY="your-merchant-key"
```

**Catatan Penting**:
- Credential default (`your-merchant-key`) akan mengaktifkan **TEST MODE** - pembayaran akan di-mock tanpa memanggil iPay88 API
- Untuk menggunakan **iPay88 Sandbox yang asli**, ganti dengan credential sandbox yang valid:
  ```env
  IPAY88_MERCHANT_CODE="ID02189"  # Contoh merchant code sandbox
  IPAY88_MERCHANT_KEY="your-real-sandbox-key"  # Key dari iPay88 sandbox account
  ```
- Dalam **Sandbox Mode**, sistem akan memanggil iPay88 API sandbox dan redirect ke halaman pembayaran iPay88 yang asli
- Untuk **Production**, gunakan merchant code dan key production dari iPay88

## API Endpoints

### 1. Checkout API
**POST** `/api/checkout`

Request body:
```json
{
  "items": [
    {
      "id": "product-123",
      "name": "Product Name",
      "price": 100000,
      "quantity": 1,
      "type": "product"
    }
  ],
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "address": "Customer Address"
  },
  "paymentMethod": "120"
}
```

Response:
```json
{
  "success": true,
  "orderNumber": "PL1234567890ABCD",
  "paymentUrl": "https://sandbox.ipay88.co.id/...",
  "transactionId": "T0061540600",
  "message": "Payment initiated successfully"
}
```

### 2. Payment Callback
**POST** `/api/payment/callback`

Endpoint untuk menerima callback dari iPay88 setelah pembayaran.

### 3. Payment Status
**GET** `/api/payment/status?orderNumber=PL1234567890ABCD`
**POST** `/api/payment/status`

Request body (POST):
```json
{
  "orderNumber": "PL1234567890ABCD"
}
```

## Payment Methods (PaymentID)

### E-Wallet
- `63` - OVO
- `77` - DANA
- `13` - LinkAja
- `76` - ShopeePay

### QRIS
- `120` - QRIS (Default)
- `141` - QRIS Static

### Virtual Account
- `140` - BCA VA
- `118` - BRI VA
- `83` - BNI VA
- `119` - Mandiri VA
- `112` - Permata VA
- `135` - CIMB VA

### Credit/Debit Card
- `101` - Credit Card (BCA)
- `105` - Credit Card (BRI)
- `103` - Credit Card (CIMB)
- `54` - UnionPay

### Over The Counter
- `60` - Alfamart
- `65` - Indomaret

## Testing

### Testing Credentials (Sandbox)
**Credit Card:**
- Card Number: `4000000000000044`
- CVV: `123`
- Exp Date: `03/33`

### URLs
- **Sandbox:** `https://sandbox.ipay88.co.id/ePayment/WebService/PaymentAPI/Checkout`
- **Production:** `https://payment.ipay88.co.id/ePayment/WebService/PaymentAPI/Checkout`

## Implementation Steps

1. **Setup Environment Variables**
   ```bash
   IPAY88_MERCHANT_CODE="your-merchant-code"
   IPAY88_MERCHANT_KEY="your-merchant-key"
   ```

2. **Register Callback URLs**
   - Response URL: `https://yourdomain.com/api/payment/response`
   - Backend URL: `https://yourdomain.com/api/payment/callback`

3. **Test Integration**
   - Use sandbox environment for testing
   - Use test credit card numbers provided above
   - Verify callback functionality

4. **Mode Selection**:
   - **TEST MODE** (default credentials): API redirects to simulated payment page (`/payment/test-payment`)
   - **SANDBOX MODE** (real sandbox credentials): API sends request to iPay88 sandbox and redirects to real iPay88 payment page
   - **PRODUCTION MODE**: API sends request to iPay88 production
5. Customer completes payment
6. iPay88 sends callback to backend (in sandbox/production) or simulated in test mode
7. Backend updates order status
8. Customer redirected to success/failure page (`/payment/finish`)
9. Selected cart items are removed after successful payment

## Mode Configurations

### Test Mode (Internal Simulation)
```env
IPAY88_MERCHANT_CODE="ID00001"
IPAY88_MERCHANT_KEY="your-merchant-key"
```
- Uses internal payment simulation
- No real API calls to iPay88
- Perfect for initial development

### Sandbox Mode (Real iPay88 Sandbox)
```env
IPAY88_MERCHANT_CODE="ID02189"  # Your sandbox merchant code
IPAY88_MERCHANT_KEY="your-real-sandbox-key"  # Your sandbox merchant key
```
- Uses real iPay88 sandbox API
- Real payment gateway interface
- Test with actual payment methods

### Production Mode
```env
IPAY88_MERCHANT_CODE="your-production-code"
IPAY88_MERCHANT_KEY="your-production-key"
NODE_ENV="production"
```
- Uses real iPay88 production API
- Real transactions with real money

## API Configuration

### Current Implementation
- **API Version**: 2.0 (Official iPay88 API) ✅
- **Signature Format**: SHA256 with `||field||` delimiter format ✅
- **Request Type**: SEAMLESS for direct API integration ✅
- **Payment Method**: BCA VA (25) - **WORKING** ✅
- **Response Format**: Uses `Code`, `CheckoutID`, and `Signature` fields ✅
- **Integration Status**: **FULLY FUNCTIONAL** 🎉

### Test Results
- ✅ Checkout API: Working
- ✅ iPay88 API Call: Success (Code: '1')
- ✅ CheckoutID Generation: Working
- ✅ Virtual Account: Assigned (2500000003596)
- ✅ Payment Gateway Redirect: Working
- ✅ Response URL Handling: Working

### Signature Generation
Format: `||MerchantKey||MerchantCode||RefNo||Amount||Currency||`

Example:
```
||your-merchant-key||ID02189||PL123456789||100000||IDR||
```

## Security Notes

- Always verify signature from iPay88 callbacks
- Use HTTPS for all payment-related endpoints
- Store sensitive credentials in environment variables
- Implement proper error handling and logging
- Validate all incoming data before processing

## Order Flow

1. Customer adds items to cart
2. Customer proceeds to checkout
3. API creates order in database
4. **TEST MODE**: API redirects to simulated payment page (`/payment/test-payment`)
   **SANDBOX/PRODUCTION**: API redirects to iPay88 payment gateway
5. Customer completes payment
6. iPay88 sends response to `/api/payment/response` → redirects to `/payment/finish`
7. iPay88 sends callback to `/api/payment/callback` → updates order status
8. Customer sees success/failure page (`/payment/finish`)
9. Selected cart items are removed after successful payment