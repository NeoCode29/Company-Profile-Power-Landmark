'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  IoMenuOutline, 
  IoCloseOutline,
  IoChevronDown,
  IoCartOutline,
  IoHomeOutline,
  IoInformationCircleOutline,
  IoConstructOutline,
  IoLayersOutline,
  IoMailOutline
} from 'react-icons/io5'

// Types
export interface NavLink {
  href: string
  label: string
  icon: React.ReactNode
  submenu?: NavLink[]
}

interface NavItemProps {
  link: NavLink
  active?: boolean
}

// Desktop navigation item component
const DesktopNavItem: React.FC<NavItemProps> = ({ link, active }) => {
  const hasSubmenu = Boolean(link.submenu && link.submenu.length > 0)
  const [isOpen, setIsOpen] = useState(false)
  const itemRef = useRef<HTMLLIElement>(null)

  const handleMouseEnter = () => setIsOpen(true)
  const handleMouseLeave = () => setIsOpen(false)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <li 
      ref={itemRef}
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={link.href} legacyBehavior>
        <a className={`inline-flex items-center px-4 py-2 rounded-md text-gray-800 group-hover:text-green-600 transition-all duration-300 font-medium relative ${
          active ? 'text-green-600' : ''
        }`}>
          <span className="mr-2 text-green-600">{link.icon}</span>
          {link.label}
          {hasSubmenu && (
            <IoChevronDown 
              size={16} 
              className={`ml-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
            />
          )}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
        </a>
      </Link>
      {hasSubmenu && isOpen && (
        <ul className="absolute left-0 top-full mt-1 bg-white/95 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden min-w-[200px] border border-gray-100 z-50 transform translate-y-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
          {link.submenu!.map((sublink) => (
            <li key={sublink.href}>
              <Link href={sublink.href} legacyBehavior>
                <a className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 border-b border-gray-100 last:border-0 hover:text-green-600">
                  {sublink.icon && (
                    <span className="text-green-600">
                      {sublink.icon}
                    </span>
                  )}
                  {sublink.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

// Mobile navigation item component
const MobileNavItem: React.FC<NavItemProps> = ({ link, active }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleSubmenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setIsExpanded((prev) => !prev)
  }

  return (
    <li className="border-b border-gray-800/30 pb-2 last:border-0">
      <div className="flex items-center justify-between">
        <Link href={link.href} legacyBehavior>
          <a className={`flex items-center gap-3 py-2 rounded text-gray-100 hover:text-green-400 font-medium text-base transition-all duration-300 ${
            active ? 'text-green-400' : ''
          }`}>
            <span className="text-green-500">{link.icon}</span>
            {link.label}
          </a>
        </Link>
        {link.submenu && (
          <button onClick={toggleSubmenu} className="text-gray-300 hover:text-green-400 transition-colors p-2">
            <IoChevronDown
              size={16}
              className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
            />
                    </button>
        )}
                </div>
      {link.submenu && isExpanded && (
        <ul className="pl-8 pt-2 space-y-3">
          {link.submenu.map((sublink) => (
            <li key={sublink.href}>
              <Link href={sublink.href} legacyBehavior>
                <a className="flex items-center gap-3 py-1 rounded hover:text-green-400 text-gray-300 transition-all duration-300">
                  {sublink.icon && (
                    <span className="text-green-500">
                      {sublink.icon}
                    </span>
                  )}
                  {sublink.label}
                </a>
              </Link>
                    </li>
          ))}
        </ul>
      )}
                    </li>
  )
}

// Main Header component
const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activePath, setActivePath] = useState('/')

  // Navigation links configuration
  const navLinks: NavLink[] = [
    { href: '/', label: 'Home', icon: <IoHomeOutline size={18} /> },
    { href: '/about', label: 'About', icon: <IoInformationCircleOutline size={18} /> },
    { href: '/service', label: 'Service', icon: <IoConstructOutline size={18} /> },
    { href: '/products', label: 'Products', icon: <IoLayersOutline size={18} /> },
    { href: '/contact', label: 'Contact', icon: <IoMailOutline size={18} /> },
  ]

  // Toggle mobile navigation menu
  const toggleNav = () => setIsNavOpen(prev => !prev)

  // Update scroll state for floating effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update active path on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActivePath(window.location.pathname)
    }
  }, [])

  return (
    <header className={`sticky top-8 z-50 transition-all duration-300 h-0 ${scrolled ? 'py-0' : 'py-0'}`}>
      {/* Main header container */}
      <div className={`container mx-auto transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl' 
          : 'bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]'
      }`}>
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <Link href="/" legacyBehavior>
            <a className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
              <Image 
                src="/images/logo.png" 
                alt="Logo" 
                width={180} 
                height={180} 
                className="w-18 h-18 lg:w-18 lg:h-18 object-contain rounded-full invert"
                priority
              />
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center gap-2">
              {navLinks.map((link) => (
                <DesktopNavItem 
                  key={link.href} 
                  link={link} 
                  active={activePath === link.href}
                />
              ))}
                    </ul>
                </nav>

          {/* Cart & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <Link href="/cart" legacyBehavior>
              <a className="relative flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-300 hover:shadow-md">
                <IoCartOutline size={20} />
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-green-600 rounded-full shadow-sm">0</span>
              </a>
            </Link>
            
            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-300 hover:shadow-md"
              onClick={toggleNav}
              aria-label="Open Menu"
            >
              <IoMenuOutline size={20} />
                </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay background */}
      <div 
        className={`fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          isNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleNav}
      />

      {/* Mobile Navigation Sidebar */}
      <div className={`lg:hidden fixed top-0 right-0 w-[280px] h-full bg-gray-900 shadow-xl z-50 transition-all duration-500 ease-in-out ${
        isNavOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex justify-between items-center p-5 border-b border-gray-800/30">
          <Link href="/" legacyBehavior>
            <a className="flex items-center space-x-2">
              <div className="relative w-8 h-8 overflow-hidden">
                <Image 
                  src="/images/logo.png" 
                  alt="Logo" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-white">PowerLandmark</span>
            </a>
          </Link>
          <button 
            onClick={toggleNav}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/30 rounded-full"
            aria-label="Close Menu"
          >
            <IoCloseOutline size={24} />
                </button>
                </div>
        <div className="p-5">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <MobileNavItem 
                key={link.href} 
                link={link} 
                active={activePath === link.href}
              />
            ))}
          </ul>
          <div className="mt-8 pt-6 border-t border-gray-800/30">
            <Link href="/cart" legacyBehavior>
              <a className="flex items-center gap-3 py-2 text-gray-100 hover:text-green-400 font-medium transition-all duration-300 group">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-900/50 text-green-500 group-hover:bg-green-800/60 transition-colors duration-300">
                  <IoCartOutline size={18} />
                </span>
                Shopping Cart
                <span className="ml-auto flex items-center justify-center min-w-6 h-6 px-2 text-xs font-bold text-white bg-green-700 rounded-full">0</span>
              </a>
            </Link>
            </div>
        </div>
      </div>
    </header>
  )
}

export default Header
