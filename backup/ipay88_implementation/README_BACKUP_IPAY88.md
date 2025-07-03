# 🔒 Backup Implementasi iPay88 - Power Landmark

## 📅 Informasi Backup
- **Tanggal Backup**: 2 Juli 2025
- **Reason**: Persiapan migrasi ke Midtrans SNAP
- **Status**: Implementasi lengkap dan tervalidasi

## 📦 Isi Backup

### 1. Core Library (`ipay88.ts`)
**File**: `ipay88.ts`
**Deskripsi**: Library utama berisi:
- Konfigurasi iPay88 (sandbox/production URLs)
- Konstanta payment methods untuk Indonesia
- Fungsi signature generation (SHA256)
- Fungsi validasi callback
- Type definitions untuk API responses

### 2. API Routes (`api_routes/`)
- **`checkout_route.ts`**: Endpoint `/api/checkout` untuk inisiasi pembayaran
- **`callback.ts`**: Endpoint `/api/payment/callback` untuk server-to-server notification
- **`response.ts`**: Endpoint `/api/payment/response` untuk user redirect
- **`payment_callback_route.ts`**: Duplikat callback route
- **`payment_response_route.ts`**: Duplikat response route

### 3. Components & Pages (`components_pages/`)
- **`checkout_page.tsx`**: Halaman checkout dengan integrasi iPay88
- **`test_payment_page.tsx`**: Halaman testing pembayaran iPay88

### 4. Configuration (`config/`)
- **`env_ipay88.example`**: Environment variables untuk iPay88
  ```
  IPAY88_MERCHANT_CODE="ID00001"
  IPAY88_MERCHANT_KEY="your-merchant-key"
  ```

### 5. Documentation
- **`permasalahan_ipay88.md`**: Troubleshooting guide lengkap
- **`UPDATE_IPAY88_PORTAL.md`**: Panduan update merchant portal

## 🔧 Konfigurasi iPay88 yang Sudah Diimplementasi

### Payment Methods Indonesia
```javascript
PAYMENT_METHODS = {
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
  // ... dan method lainnya
}
```

### Kredensial Sandbox
- **Merchant Code**: `ID02189`
- **Merchant Key**: `Lqb4Mpq4H7`
- **Sandbox URL**: `https://sandbox.ipay88.co.id/ePayment/WebService/PaymentAPI/Checkout`

## 🚀 Cara Mengembalikan Implementasi iPay88

### 1. Restore Core Library
```bash
# Copy library utama
cp backup/ipay88_implementation/ipay88.ts src/lib/

# Update import di file yang membutuhkan
import { PAYMENT_METHODS, IPAY88_CONFIG } from '@/lib/ipay88'
```

### 2. Restore API Routes
```bash
# Copy semua API routes
cp backup/ipay88_implementation/api_routes/checkout_route.ts src/app/api/checkout/route.ts
cp backup/ipay88_implementation/api_routes/callback.ts src/app/api/payment/callback/route.ts  
cp backup/ipay88_implementation/api_routes/response.ts src/app/api/payment/response/route.ts
```

### 3. Restore Pages & Components
```bash
# Copy halaman checkout dan test
cp backup/ipay88_implementation/components_pages/checkout_page.tsx src/app/checkout/page.tsx
cp backup/ipay88_implementation/components_pages/test_payment_page.tsx src/app/payment/test-payment/page.tsx
```

### 4. Environment Configuration
```bash
# Add ke .env.local
IPAY88_MERCHANT_CODE="ID02189"
IPAY88_MERCHANT_KEY="Lqb4Mpq4H7"
```

### 5. Update next.config.ts
```javascript
// Add CSP untuk iPay88
{
  key: 'Content-Security-Policy',
  value: "frame-ancestors 'self' *.ipay88.co.id sandbox.ipay88.co.id;"
}
```

### 6. Update middleware.ts
```javascript
// Skip auth untuk iPay88 callbacks
export const config = {
  matcher: ['/((?!api/auth|api/payment/callback|api/payment/response).*)']
}
```

## 🔍 Testing Setelah Restore

### 1. Checkout Flow
```bash
npm run dev
# Navigate to http://localhost:3000/checkout
# Test payment dengan amount 1.00 IDR
```

### 2. Callback Testing
```bash
# Test endpoint callback
POST http://localhost:3000/api/payment/callback
# Dengan payload iPay88 yang valid
```

### 3. Response Testing
```bash
# Test redirect
GET http://localhost:3000/api/payment/response?status=1&...
```

## 📋 Known Issues & Solutions

### 1. Signature Mismatch
**Problem**: iPay88 signature tidak match
**Solution**: Pastikan format signature string benar:
```javascript
const signatureString = `||${MERCHANT_KEY}||${MerchantCode}||${RefNo}||${Amount}||${Currency}||`;
```

### 2. Redirect ke cvpowerlandmark.com
**Problem**: iPay88 redirect ke URL lama
**Solution**: Update merchant portal atau gunakan temporary fix di response route

### 3. CORS Issues
**Problem**: CORS error dari iPay88
**Solution**: Set headers yang benar di API routes:
```javascript
return new Response(result, {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  }
});
```

## 🛡️ Security Notes

1. **Credential Management**: Jangan hardcode merchant key di client-side
2. **Signature Validation**: Selalu validasi signature di callback
3. **HTTPS Only**: Gunakan HTTPS untuk production
4. **URL Whitelisting**: Pastikan response/callback URLs di-whitelist di portal

## 📞 Support Information

### iPay88 Indonesia
- **Portal**: https://sandbox.ipay88.co.id/merchantportal
- **Email**: support@ipay88.co.id
- **Phone**: +62-21-2261-4668

### Dokumentasi
- **API Docs**: https://docs.ipay88.co.id
- **Integration Guide**: Lihat `permasalahan_ipay88.md`

## ✅ Validation Checklist

Sebelum restore iPay88:
- [ ] Backup implementasi Midtrans yang ada
- [ ] Update environment variables
- [ ] Test signature generation
- [ ] Verify merchant portal configuration
- [ ] Test payment flow end-to-end
- [ ] Validate callback handling
- [ ] Check CORS configuration

---

**⚠️ PENTING**: Backup ini berisi implementasi iPay88 yang sudah tervalidasi dan siap production. Gunakan sebagai referensi atau untuk rollback jika diperlukan migrasi kembali dari Midtrans. 