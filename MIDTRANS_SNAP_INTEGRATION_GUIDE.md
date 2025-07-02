# Panduan Integrasi Midtrans SNAP

## Pengenalan

Midtrans SNAP adalah solusi pembayaran dengan antarmuka bawaan (Built-in Interface) yang menyediakan halaman checkout yang sudah siap pakai. SNAP menawarkan dua mode tampilan:
- **Pop Up Mode**: Modal overlay di atas halaman merchant
- **Embedded Mode**: Tertanam langsung di halaman merchant

## Langkah-langkah Integrasi

### 1. Persiapan

#### Environment URLs:
- **Sandbox**: `https://app.sandbox.midtrans.com/snap/snap.js`
- **Production**: `https://app.midtrans.com/snap/snap.js`

#### Kredensial yang Diperlukan:
- **Client Key**: Untuk frontend integration
- **Server Key**: Untuk backend API calls
- **Merchant ID (MID)**: Identifier merchant

### 2. Mendapatkan Transaction Token di Backend

#### API Endpoint:
- **Sandbox**: `https://app.sandbox.midtrans.com/snap/v1/transactions`
- **Production**: `https://app.midtrans.com/snap/v1/transactions`

#### Sample Request Body:
```json
{
  "transaction_details": {
    "order_id": "order-101",
    "gross_amount": 10000
  },
  "credit_card": {
    "secure": true
  },
  "customer_details": {
    "first_name": "budi",
    "last_name": "pratama",
    "email": "budi.pra@example.com",
    "phone": "08111222333"
  }
}
```

#### Headers Required:
```
Authorization: Basic {Base64(SERVER_KEY:)}
Content-Type: application/json
Accept: application/json
```

#### Response:
```json
{
  "token": "66e4fa55-fdac-4ef9-91b5-733b97d1b862",
  "redirect_url": "https://app.sandbox.midtrans.com/snap/v2/vtweb/66e4fa55-fdac-4ef9-91b5-733b97d1b862"
}
```

### 3. Menampilkan Halaman Pembayaran di Frontend

#### A. Pop Up Mode

##### Basic Implementation:
```html
<script type="text/javascript"
  src="https://app.sandbox.midtrans.com/snap/snap.js"
  data-client-key="SET_YOUR_CLIENT_KEY_HERE"></script>

<button id="pay-button">Pay!</button>

<script type="text/javascript">
  var payButton = document.getElementById('pay-button');
  payButton.addEventListener('click', function () {
    window.snap.pay('TRANSACTION_TOKEN_HERE');
  });
</script>
```

##### With JavaScript Callbacks:
```html
<script type="text/javascript">
  window.snap.pay('TRANSACTION_TOKEN_HERE', {
    onSuccess: function(result){
      alert("payment success!"); 
      console.log(result);
    },
    onPending: function(result){
      alert("waiting your payment!"); 
      console.log(result);
    },
    onError: function(result){
      alert("payment failed!"); 
      console.log(result);
    },
    onClose: function(){
      alert('you closed the popup without finishing the payment');
    }
  });
</script>
```

#### B. Embedded Mode

```html
<div id="snap-container"></div>

<script type="text/javascript"
  src="https://app.sandbox.midtrans.com/snap/snap.js"
  data-client-key="SET_YOUR_CLIENT_KEY_HERE"></script>

<script type="text/javascript">
  window.snap.embed('TRANSACTION_TOKEN_HERE', {
    embedId: 'snap-container'
  });
</script>
```

#### C. Redirect Method (Alternative)

Langsung redirect ke `redirect_url` yang didapat dari response backend:
```javascript
window.location.href = redirect_url;
```

### 4. Konfigurasi SNAP Preference

#### Melalui Dashboard:
1. Login ke Midtrans Administration Portal (MAP)
2. **SETTINGS > SNAP PREFERENCE**

#### Pengaturan Penting:
- **Payment Methods**: Aktifkan metode pembayaran yang diinginkan
- **Expire Time**: Waktu kadaluarsa transaksi
- **Finish URL**: URL redirect setelah pembayaran sukses
- **Unfinish URL**: URL redirect untuk pembayaran belum selesai
- **Error URL**: URL redirect untuk error pembayaran
- **Payment Notification URL**: URL webhook untuk notifikasi status

### 5. Testing Payment

#### Test Credentials untuk Card Payment:
| Field | Value |
|-------|-------|
| Card Number | 4811 1111 1111 1114 |
| CVV | 123 |
| Exp Month | 02 (format MM) |
| Exp Year | 2025 (format YYYY) |
| OTP/3DS | 112233 |

### 6. Handling Setelah Pembayaran

#### HTTP Notification/Webhooks

Midtrans akan mengirim HTTP POST request ke Payment Notification URL dengan format:

```json
{
  "transaction_time": "2020-01-09 18:27:19",
  "transaction_status": "capture",
  "transaction_id": "57d5293c-e65f-4a29-95e4-5959c3fa335b",
  "status_message": "midtrans payment notification",
  "status_code": "200",
  "signature_key": "6bcdb3720d....",
  "payment_type": "credit_card",
  "order_id": "order-101",
  "merchant_id": "G812785002",
  "masked_card": "481111-1114",
  "gross_amount": "10000.00",
  "fraud_status": "accept",
  "eci": "05",
  "currency": "IDR",
  "channel_response_message": "Approved",
  "channel_response_code": "00",
  "card_type": "credit",
  "bank": "bni",
  "approval_code": "1578569243927"
}
```

#### Transaction Status:
- **capture**: Pembayaran berhasil
- **settlement**: Pembayaran telah diselesaikan
- **pending**: Menunggu pembayaran
- **deny**: Pembayaran ditolak
- **cancel**: Pembayaran dibatalkan
- **expire**: Pembayaran kadaluarsa
- **failure**: Pembayaran gagal

### 7. Fitur Advanced

#### Custom Field untuk Tracking:
```json
{
  "custom_field1": "custom field 1 content",
  "custom_field2": "custom field 2 content",
  "custom_field3": "custom field 3 content"
}
```

#### Item Details:
```json
{
  "item_details": [
    {
      "id": "ITEM1",
      "price": 10000,
      "quantity": 1,
      "name": "Midtrans Bear",
      "brand": "Midtrans",
      "category": "Toys",
      "merchant_name": "Midtrans"
    }
  ]
}
```

#### Billing & Shipping Address:
```json
{
  "customer_details": {
    "billing_address": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@doe.com",
      "phone": "081 2233 44-55",
      "address": "Sudirman",
      "city": "Jakarta",
      "postal_code": "12190",
      "country_code": "IDN"
    },
    "shipping_address": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@doe.com",
      "phone": "081 2233 44-55",
      "address": "Sudirman",
      "city": "Jakarta",
      "postal_code": "12190",
      "country_code": "IDN"
    }
  }
}
```

## Best Practices

### 1. Security
- Selalu gunakan HTTPS untuk production
- Jangan expose Server Key di frontend
- Validasi signature key untuk notification
- Implement proper error handling

### 2. User Experience
- Gunakan callback functions untuk handling response
- Implement loading states
- Provide clear error messages
- Mobile responsive design

### 3. Integration Notes
- Tidak bisa menampilkan Snap Pop Up dan Embed bersamaan
- Gunakan method `hide()` untuk menutup Snap window
- Header bisa disembunyikan melalui Dashboard > Theme and Logo
- Maximum 1 Snap instance aktif pada satu waktu

### 4. Mobile Integration
- Support WebView integration
- Responsive design dengan flexbox
- Viewport meta tag diperlukan

## Metode Pembayaran yang Didukung

- **Credit/Debit Card**: Visa, Mastercard, JCB
- **Bank Transfer**: BCA, BNI, BRI, Permata, Mandiri
- **E-Wallet**: GoPay, DANA, ShopeePay, LinkAja
- **Over the Counter**: Indomaret, Alfamart
- **QRIS**: Quick Response Indonesian Standard
- **Cardless Credit**: Akulaku, Kredivo

## Error Codes

### Common Status Codes:
- **200**: Success
- **201**: Created successfully
- **400**: Bad request/validation error
- **401**: Unauthorized access
- **404**: Not found
- **409**: Duplicate order_id
- **413**: Request entity too large

## Resources

- [Midtrans Documentation](https://docs.midtrans.com/)
- [Testing Payment Guide](https://docs.midtrans.com/docs/testing-payment-on-sandbox)
- [Postman Collection](https://documenter.getpostman.com/view/3404295/)
- [GitHub Sample Codes](https://github.com/Midtrans)

---

*Dokumentasi ini dibuat berdasarkan Midtrans SNAP Integration Guide untuk referensi pengembangan tim.* 