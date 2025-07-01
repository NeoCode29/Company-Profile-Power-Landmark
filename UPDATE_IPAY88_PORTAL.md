# Update Konfigurasi iPay88 Merchant Portal untuk Testing

## 🚨 Masalah yang Terjadi

Sistem redirect ke `https://www.cvpowerlandmark.com//api/payment/response` karena **konfigurasi lama masih aktif di iPay88 Merchant Portal**.

## 🔧 Solusi: Update iPay88 Portal Configuration

### 1. Login ke iPay88 Merchant Portal

**Sandbox Portal:**
- URL: https://sandbox.ipay88.co.id/merchantportal
- Username: `powerlandmark`
- Password: `123456`

### 2. Update URL Configuration

Cari menu **"Settings"** atau **"Configuration"** dan update:

#### A. Response URL (User Redirect)
```
LAMA: https://www.cvpowerlandmark.com/api/payment/response
BARU: http://localhost:3000/payment/status
```

#### B. Backend URL (Server Callback)  
```
LAMA: https://www.cvpowerlandmark.com/api/payment/callback
BARU: http://localhost:3000/api/payment/callback
```

#### C. Domain Whitelist
Tambahkan domain untuk testing:
```
- localhost:3000
- http://localhost:3000  
- 127.0.0.1:3000
```

### 3. Lokasi Setting di Portal

Biasanya setting URL ada di:
- **"Merchant Settings"**
- **"Integration Settings"**  
- **"Payment Configuration"**
- **"Callback URLs"**

### 4. Parameter yang Perlu Diupdate

| Setting | Value untuk Testing |
|---------|-------------------|
| **Response URL** | `http://localhost:3000/payment/status` |
| **Backend URL** | `http://localhost:3000/api/payment/callback` |
| **Domain** | `localhost:3000` |
| **Environment** | `Sandbox` |

## 🔄 Temporary Fix (Sudah Diterapkan)

Sementara menunggu update portal, saya sudah **update endpoint lama** `/api/payment/response` untuk redirect ke localhost:

```javascript
// File: src/app/api/payment/response/route.ts
// Sekarang akan redirect ke: http://localhost:3000/payment/status
```

## 📞 Jika Tidak Bisa Update Portal Sendiri

**Hubungi iPay88 Support:**
- Email: `support@ipay88.co.id`
- Phone: `+62-21-2261-4668`

**Informasi yang perlu diberikan:**
```
Subject: Update Callback URLs untuk Testing - Merchant ID02189

Dear iPay88 Support,

Mohon bantuan untuk update konfigurasi callback URLs untuk merchant berikut:

Merchant Code: ID02189
Merchant Name: Power Landmark

Konfigurasi baru untuk SANDBOX testing:
- Response URL: http://localhost:3000/payment/status
- Backend URL: http://localhost:3000/api/payment/callback  
- Domain Whitelist: localhost:3000, 127.0.0.1:3000

Environment: Sandbox
Purpose: Development Testing

Terima kasih.
```

## ✅ Verifikasi Setup Berhasil

Setelah update portal, lakukan testing:

1. **Checkout dengan payment method apapun**
2. **Selesaikan payment di iPay88**  
3. **Pastikan redirect ke:** `http://localhost:3000/payment/status?orderNumber=...`
4. **Bukan ke:** `cvpowerlandmark.com/api/payment/response`

## 🔍 Debug Logs untuk Verifikasi

Monitor console dan cek:
```
✅ ResponseURL sent to iPay88: http://localhost:3000/payment/status
✅ BackendURL sent to iPay88: http://localhost:3000/api/payment/callback
✅ iPay88 redirects to: localhost:3000 (bukan cvpowerlandmark.com)
```

## 📋 Checklist Update

- [ ] Login ke iPay88 merchant portal
- [ ] Update Response URL ke `http://localhost:3000/payment/status`  
- [ ] Update Backend URL ke `http://localhost:3000/api/payment/callback`
- [ ] Tambahkan domain `localhost:3000` ke whitelist
- [ ] Save configuration
- [ ] Test payment flow
- [ ] Verifikasi redirect ke localhost (bukan cvpowerlandmark.com)

## 🚀 Setelah Testing Selesai

Ketika sudah siap production, update kembali ke:
- Response URL: `https://www.cvpowerlandmark.com/payment/status`
- Backend URL: `https://www.cvpowerlandmark.com/api/payment/callback`
- Domain: `www.cvpowerlandmark.com` 