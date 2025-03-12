'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  IoMenuOutline, 
  IoCloseOutline, 
  IoLogoWhatsapp,
  IoWalletOutline 
} from 'react-icons/io5'

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false)

  // Toggle navigation
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  // Navigation links
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/service', label: 'Service' }
  ]

  return (
    <header className="bg-white text-gray-900 sticky top-0 z-50 border-b-gray-300">
      {/* Overlay for mobile menu */}
      <div 
        className={`fixed inset-0 bg-gray-900/70 transition-all duration-300 ${
          isNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleNav}
      />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image 
              src="/images/logo.jpg" 
              alt="Logo" 
              width={80} 
              height={80} 
              className="w-20 h-20 object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-8">
            <ul className="flex items-center gap-16">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-gray-900 hover:text-green-400 font-semibold text-lg transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>


          {/* Action Buttons - Right Aligned */}
          <div className="hidden lg:flex items-center gap-3">
              <a 
                href="https://wa.me/+622129222999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300 flex items-center gap-2 text-sm"
              >
                <IoLogoWhatsapp size={16} />
                <span>Contact Us</span>
              </a>

              <a 
                href="/payments" 
                className="bg-gray-200 text-gray-900 px-4 py-2 rounded-full hover:bg-gray-300 transition-colors duration-300 flex items-center gap-2 text-sm"
              >
                <IoWalletOutline size={16} />
                <span>Payment</span>
              </a>
            </div>

          {/* Mobile Navigation */}
          <nav className={`lg:hidden fixed top-0 w-[300px] h-full bg-gray-900 shadow-lg z-50 transition-all duration-300 ease-in-out ${
            isNavOpen ? 'right-0' : '-right-[310px]'
          }`}>
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <Link href="/" className="flex-shrink-0">
                <Image 
                  src="/images/logo.png" 
                  alt="Logo" 
                  width={60} 
                  height={60} 
                  className="w-15 h-15 object-contain"
                />
              </Link>
              <button 
                onClick={toggleNav}
                className="text-white hover:text-green-400 transition-colors"
                aria-label="Close Menu"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>

            <ul className="p-6 space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-green-400 font-semibold text-base block py-2 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              
              {/* Mobile Action Buttons */}
              <li className="pt-4 space-y-3">
                <a 
                  href="https://wa.me/+622129222999" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300 flex items-center gap-2 justify-center w-full text-sm"
                >
                  <IoLogoWhatsapp size={16} />
                  <span>Contact Us</span>
                </a>

                <Link 
                  href="/payments" 
                  className="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2 justify-center w-full text-sm"
                >
                  <IoWalletOutline size={16} />
                  <span>Payment</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button - also smaller */}
          <button 
            className="lg:hidden w-10 h-10 bg-green-500 text-white rounded-full shadow-md flex items-center justify-center hover:bg-green-600 transition-colors"
            onClick={toggleNav}
            aria-label="Open Menu"
          >
            <IoMenuOutline size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header