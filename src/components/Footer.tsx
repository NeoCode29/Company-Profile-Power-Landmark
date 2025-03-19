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
            <p className="mt-4 text-gray-700 leading-relaxed">
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
