'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  IoLogoFacebook, 
  IoLogoTwitter, 
  IoLogoInstagram, 
  IoLogoLinkedin, 
  IoLocationOutline, 
  IoCallOutline, 
  IoMailOutline
} from 'react-icons/io5'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  // Kategori footer links
  const footerLinks = [
    {
      title: 'Perusahaan',
      links: [
        { label: 'Tentang Kami', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Semua Properti', href: '/properties' },
        { label: 'Lokasi', href: '/locations' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Hubungi Kami', href: '/contact' },
      ]
    },
    {
      title: 'Layanan',
      links: [
        { label: 'Lacak Pesanan', href: '/tracking' },
        { label: 'Wishlist', href: '/wishlist' },
        { label: 'Login', href: '/login' },
        { label: 'Akun Saya', href: '/account' },
        { label: 'Syarat & Ketentuan', href: '/terms' },
        { label: 'Penawaran Promosi', href: '/promotions' },
      ]
    },
    {
      title: 'Dukungan Pelanggan',
      links: [
        { label: 'Login', href: '/login' },
        { label: 'Akun Saya', href: '/account' },
        { label: 'Wishlist', href: '/wishlist' },
        { label: 'Lacak Pesanan', href: '/tracking' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Hubungi Kami', href: '/contact' },
      ]
    }
  ]

  return (
    <footer className="bg-gray-900 text-white pt-16">
      <div className="container mx-auto px-4">
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/images/logo-light.png" 
                alt="Power Landmark" 
                width={180} 
                height={60}
                className="h-12 w-auto"
              />
            </Link>

            <p className="text-gray-400 mb-8 leading-relaxed">
              Kami adalah perusahaan properti terkemuka yang menyediakan solusi perumahan dan investasi terbaik untuk klien kami.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <IoLocationOutline className="text-orange-500 text-xl flex-shrink-0 mt-1" />
                <address className="text-gray-400 not-italic">
                  Jl. Kemang Raya No. 15, Jakarta Selatan, Indonesia
                </address>
              </div>

              <div className="flex items-center gap-3">
                <IoCallOutline className="text-orange-500 text-xl flex-shrink-0" />
                <a href="tel:+6221123456789" className="text-gray-400 hover:text-orange-500 transition-colors">
                  +62 21 123 456 789
                </a>
              </div>

              <div className="flex items-center gap-3">
                <IoMailOutline className="text-orange-500 text-xl flex-shrink-0" />
                <a href="mailto:info@powerlandmark.com" className="text-gray-400 hover:text-orange-500 transition-colors">
                  info@powerlandmark.com
                </a>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                aria-label="Facebook"
              >
                <IoLogoFacebook />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                aria-label="Twitter"
              >
                <IoLogoTwitter />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                aria-label="Instagram"
              >
                <IoLogoInstagram />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                aria-label="LinkedIn"
              >
                <IoLogoLinkedin />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {footerLinks.map((category, index) => (
                <div key={index}>
                  <h4 className="text-white text-lg font-semibold mb-6">
                    {category.title}
                  </h4>
                  <ul className="space-y-4">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link 
                          href={link.href}
                          className="text-gray-400 hover:text-orange-500 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 py-8 text-center text-gray-400">
          <p>
            &copy; {currentYear} <Link href="/" className="text-white hover:text-orange-500 transition-colors">Power Landmark</Link>. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 