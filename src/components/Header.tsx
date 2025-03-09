'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IoSearchOutline, IoPersonOutline, IoCartOutline, IoMenuOutline, IoCloseOutline } from 'react-icons/io5'

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Toggle navigation
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  // Navigation links
  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#service', label: 'Service' },
    { href: '#property', label: 'Property' },
    { href: '#blog', label: 'Blog' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <header className={`relative z-[2] transition-all duration-300 ${isScrolled ? 'pb-[114px]' : ''}`}>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/70 transition-all duration-300 ${
          isNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleNav}
      />

      {/* Header Content */}
      <div className={`bg-black text-white py-6 ${
        isScrolled ? 'fixed w-full top-0 shadow-lg animate-slideDown' : ''
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
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
            <nav className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-white hover:text-orange-500 font-semibold text-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Navigation */}
            <nav className={`lg:hidden fixed top-0 w-[300px] h-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out ${
              isNavOpen ? 'right-0' : '-right-[310px]'
            }`}>
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <Link href="/" className="flex-shrink-0">
                  <Image 
                    src="/images/logo.jpg" 
                    alt="Logo" 
                    width={60} 
                    height={60} 
                    className="w-15 h-15 object-contain"
                  />
                </Link>
                <button 
                  onClick={toggleNav}
                  className="text-gray-600 hover:text-orange-500 transition-colors"
                  aria-label="Close Menu"
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>

              <ul className="p-6 space-y-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-orange-500 font-semibold text-base block py-2 transition-colors"
                      onClick={toggleNav}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button className="w-12 h-12 bg-white text-gray-700 rounded-full shadow-md flex items-center justify-center hover:text-orange-500 transition-colors" aria-label="Search">
                <IoSearchOutline size={20} />
              </button>

              <button className="w-12 h-12 bg-white text-gray-700 rounded-full shadow-md flex items-center justify-center hover:text-orange-500 transition-colors" aria-label="Profile">
                <IoPersonOutline size={20} />
              </button>

              <button className="w-12 h-12 bg-white text-gray-700 rounded-full shadow-md flex items-center justify-center hover:text-orange-500 transition-colors" aria-label="Cart">
                <IoCartOutline size={20} />
              </button>

              <button 
                className="lg:hidden w-12 h-12 bg-white text-gray-700 rounded-full shadow-md flex items-center justify-center hover:text-orange-500 transition-colors"
                onClick={toggleNav}
                aria-label="Open Menu"
              >
                <IoMenuOutline size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header