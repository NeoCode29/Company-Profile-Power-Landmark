import Link from 'next/link';
import Image from 'next/image';
import {
  IoLogoWhatsapp,
  IoCallOutline,
  IoGlobeOutline,
  IoMailOutline,
  IoLocationOutline,
} from 'react-icons/io5';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 border-t border-gray-200">
      {/* Konten Utama */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
          {/* Logo & Deskripsi */}
          <div className="md:w-1/3 text-center md:text-left">
            <Image
              src="/images/logo.jpg"
              alt="Power Landmark Logo"
              width={150}
              height={150}
              className="mx-auto md:mx-0 rounded-full"
            />
            <h2 className="mt-4 text-xl font-bold text-gray-900">PT POWER LANDMARK</h2>
            <p className="mt-2 text-gray-700 leading-relaxed">
              Power Landmark adalah perusahaan terdepan di bidang solusi digital, menyediakan inovasi teknologi untuk mendukung pertumbuhan bisnis Anda.
            </p>
          </div>
          {/* Informasi Kontak */}
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <IoCallOutline className="text-2xl text-green-500 mr-3" />
                  <span className="text-gray-700">+62-21-29222999</span>
                </li>
                <li className="flex items-center">
                  <IoMailOutline className="text-2xl text-green-500 mr-3" />
                  <span className="text-gray-700">admin@cvpowerlandmark.com</span>
                </li>
                <li className="flex items-center">
                  <IoLogoWhatsapp className="text-2xl text-green-500 mr-3" />
                  <a
                    href="https://wa.me/6282129222999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:underline"
                  >
                    WhatsApp Chat
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Information</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <IoGlobeOutline className="text-2xl text-green-500 mr-3" />
                  <Link
                    href="https://www.cvpowerlandmark.com"
                    className="text-gray-700 hover:underline"
                  >
                    www.cvpowerlandmark.com
                  </Link>
                </li>
                <li className="flex items-center">
                  <IoLocationOutline className="text-5xl text-green-500 mr-3" />
                  <span className="text-gray-700">
                    Prominence Office Tower Lt 28 Suite C, Jl Sutera Barat No 15, Alam Sutera, Tangerang, Indonesia
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Metode Pembayaran */}
      <div className="container mx-auto px-4 py-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Metode Pembayaran yang Diterima
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Bank Transfer */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Bank Transfer</h4>
            <div className="flex items-center gap-4">
              <Image src="/images/payment-gateway/bni.png" alt="BNI" width={50} height={50} />
              <Image src="/images/payment-gateway/bca.png" alt="BCA" width={50} height={50} />
              <Image src="/images/payment-gateway/mandiri.png" alt="Mandiri" width={50} height={50} />
              <Image src="/images/payment-gateway/permata.png" alt="Permata" width={50} height={50} />
            </div>
          </div>
          {/* Dompet Digital / E-Wallet */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Dompet Digital / E-Wallet</h4>
            <div className="flex items-center gap-4">
              <Image src="/images/payment-gateway/dana.png" alt="Dana" width={50} height={50} />
              <Image src="/images/payment-gateway/google-pay.png" alt="Google Pay" width={50} height={50} />
              <Image src="/images/payment-gateway/gopay.png" alt="Gopay" width={50} height={50} />
              <Image src="/images/payment-gateway/shopee-pay.png" alt="Shopee Pay" width={50} height={50} />
            </div>
          </div>
          {/* Kartu Kredit / Internasional */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Kartu Kredit / Internasional</h4>
            <div className="flex items-center gap-4">
              <Image src="/images/payment-gateway/jcb.png" alt="JCB" width={50} height={50} />
              <Image src="/images/payment-gateway/mastercard.png" alt="Mastercard" width={50} height={50} />
              <Image src="/images/payment-gateway/visa.png" alt="Visa" width={50} height={50} />
            </div>
          </div>
          {/* Cicilan */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Cicilan</h4>
            <div className="flex items-center gap-4">
              <Image src="/images/payment-gateway/akulaku.png" alt="Akulaku" width={50} height={50} />
              <Image src="/images/payment-gateway/kredivo.png" alt="Kredivo" width={50} height={50} />
            </div>
          </div>
          {/* Retail / QR */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Retail / QR</h4>
            <div className="flex items-center gap-4">
              <Image src="/images/payment-gateway/indomaret.png" alt="Indomaret" width={50} height={50} />
              <Image src="/images/payment-gateway/qris.png" alt="QRIS" width={50} height={50} />
            </div>
          </div>
        </div>
      </div>

      {/* Baris Bawah Footer */}
      <div className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-gray-600 text-sm">
          <span>&copy; {new Date().getFullYear()} Power Landmark. All rights reserved.</span>
          <span className="hidden sm:block">|</span>
          <Link href="/terms" className="text-gray-600 hover:underline">
            Terms and Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
