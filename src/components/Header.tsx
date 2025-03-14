// 'use client'

// import React, { useState } from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { 
//   IoMenuOutline, 
//   IoCloseOutline, 
//   IoLogoWhatsapp,
//   IoWallet 
// } from 'react-icons/io5'
// import NavigationMenu from './NavigationMenu'

// const Header = () => {
//   const [isNavOpen, setIsNavOpen] = useState(false)

//   // Toggle navigation
//   const toggleNav = () => {
//     setIsNavOpen(!isNavOpen)
//   }

//   // Navigation links
//   const navLinks = [
//     { href: '/', label: 'Home' },
//     { href: '/about', label: 'About' },
//     { href: '/service', label: 'Service' }
//   ]

//   return (
//     <header className="text-gray-900 bg-transparent sticky lg:top-8 z-50 rounded-lg h-0">
      
//       {/* Overlay for mobile menu */}
//       <div 
//         className={`fixed inset-0 bg-gray-900/70 transition-all duration-300 ${
//           isNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//         }`}
//         onClick={toggleNav}
//       />

//       <div className="lg:rounded-lg shadow-lg container mx-auto bg-white px-6 ">
//         <div className="lg:grid lg:grid-cols-3 flex justify-between items-center">
//           {/* Logo */}
//           <Link href="/" className="flex-shrink-0">
//             <Image 
//               src="/images/logo.png" 
//               alt="Logo" 
//               width={180} 
//               height={180} 
//               className="w-18 h-18 lg:w-24 lg:h-24 object-contain rounded-full invert"
//               priority
//             />
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden lg:flex items-center justify-center gap-8">
//             <ul className="flex items-center gap-16">
//               {navLinks.map((link) => (
//                 <li key={link.href}>
//                   <a 
//                     href={link.href}
//                     className="text-gray-900 hover:text-green-400 font-bold text-xl transition-colors"
//                   >
//                     {link.label}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </nav>


//           {/* Action Buttons - Right Aligned */}
//           <div className="hidden lg:flex items-center gap-3 font-bold justify-self-end">
//               <a 
//                   href="/payment" 
//                   className="bg-gray-200 text-gray-900 p-3 px-4 rounded-md hover:bg-gray-300 transition-colors duration-300 flex items-center gap-2 text-sm"
//                   >
//                   <IoWallet size={20} />
//                   <span>Payment</span>
//               </a>
//               <a 
//                 href="https://wa.me/+622129222999" 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center gap-2 text-sm"
//               >
//                 <IoLogoWhatsapp size={20} fontWeight={900}/>
//                 <span>Contact Us</span>
//               </a>
//           </div>

//           {/* Mobile Navigation */}
//           <nav className={`lg:hidden fixed top-0 w-[300px] h-full bg-gray-900 shadow-lg z-50 transition-all duration-300 ease-in-out ${
//             isNavOpen ? 'right-0' : '-right-[310px]'
//           }`}>
//             <div className="flex justify-between items-center p-6">
//               <Link href="/" className="flex-shrink-0">
//                 <Image 
//                   src="/images/logo.png" 
//                   alt="Logo" 
//                   width={60} 
//                   height={60} 
//                   className="w-15 h-15 object-contain"
//                 />
//               </Link>
//               <button 
//                 onClick={toggleNav}
//                 className="text-white hover:text-green-400 transition-colors"
//                 aria-label="Close Menu"
//               >
//                 <IoCloseOutline size={24} />
//               </button>
//             </div>

//             <ul className="p-6 space-y-4">
//               {navLinks.map((link) => (
//                 <li key={link.href}>
//                   <a 
//                     href={link.href}
//                     className="text-gray-300 hover:text-green-400 font-semibold text-base block py-2 transition-colors"
//                   >
//                     {link.label}
//                   </a>
//                 </li>
//               ))}
              
//               {/* Mobile Action Buttons */}
//               <li className="pt-4 space-y-3">
//                 <a 
//                   href="https://wa.me/+622129222999" 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300 flex items-center gap-2 justify-center w-full text-sm"
//                 >
//                   <IoLogoWhatsapp size={16} />
//                   <span>Contact Us</span>
//                 </a>

//                 <Link 
//                   href="/payment" 
//                   className="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2 justify-center w-full text-sm"
//                 >
//                   <IoWallet size={16} />
//                   <span>Payment</span>
//                 </Link>
//               </li>
//             </ul>
//           </nav>

//           {/* Mobile Menu Button - also smaller */}
//           <button 
//             className="lg:hidden w-12 h-12 bg-gray-200 text-black rounded-md shadow-md flex items-center justify-center hover:bg-gray-300 transition-colors"
//             onClick={toggleNav}
//             aria-label="Open Menu"
//           >
//             <IoMenuOutline size={18} />
//           </button>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Header
'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  IoMenuOutline, 
  IoCloseOutline, 
  IoLogoWhatsapp,
  IoWallet,
  IoChevronDown,
  IoCallOutline
} from 'react-icons/io5'

// Tipe untuk link navigasi
export interface NavLink {
  href: string
  label: string
  icon?: React.ReactNode
  submenu?: NavLink[]
}

// Komponen item navigasi untuk desktop dengan submenu
interface DesktopNavItemProps {
  link: NavLink
}

const DesktopNavItem: React.FC<DesktopNavItemProps> = ({ link }) => {
  const hasSubmenu = Boolean(link.submenu && link.submenu.length > 0)
  const [isOpen, setIsOpen] = useState(false)
  const itemRef = useRef<HTMLLIElement>(null)

  const handleMouseEnter = () => setIsOpen(true)

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
      className="relative"
      onMouseEnter={handleMouseEnter}
    >
      <Link href={link.href} legacyBehavior>
        <a className="inline-flex items-center px-2 py-1 rounded text-gray-900 hover:text-green-400 font-bold text-xl ">
          {link.label}
          {hasSubmenu && (
            <IoChevronDown 
              size={16} 
              className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
            />
          )}
        </a>
      </Link>
      {hasSubmenu && isOpen && (
        <ul className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg overflow-hidden min-w-max">
          {link.submenu!.map((sublink) => (
            <li key={sublink.href}>
              <Link href={sublink.href} legacyBehavior>
                <a className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition-colors text-gray-700">
                  {sublink.icon && (
                    <span className="text-gray-700">
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

// Komponen item navigasi untuk mobile
interface MobileNavItemProps {
  link: NavLink
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ link }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleSubmenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setIsExpanded((prev) => !prev)
  }

  return (
    <li>
      <div className="flex items-center justify-between">
        <Link href={link.href} legacyBehavior>
          <a className="block px-2 py-1 rounded text-gray-300 hover:text-green-400 font-semibold text-base">
            {link.label}
          </a>
        </Link>
        {link.submenu && (
          <button onClick={toggleSubmenu} className="text-gray-300 hover:text-green-400 transition-colors">
            <IoChevronDown
              size={16}
              className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
        )}
      </div>
      {link.submenu && isExpanded && (
        <ul className="pl-4 pt-4">
          {link.submenu.map((sublink) => (
            <li key={sublink.href}>
              <Link href={sublink.href} legacyBehavior>
                <a className="flex items-center gap-2 px-2 py-1 rounded hover:text-green-400 mb-2 font-semibold text-base text-white font-bold">
                  {sublink.icon && (
                    <span>
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

const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)

  // Toggle untuk mobile navigation
  const toggleNav = () => {
    setIsNavOpen((prev) => !prev)
  }

  // Daftar link navigasi, termasuk submenu untuk "Service"
  const navLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { 
      href: '/service', 
      label: 'Service',
      submenu: [
        { href: 'tel:+622129222999', label: 'Contact Us', icon: <IoCallOutline size={16} /> },
        { href: '/payment', label: 'Payment', icon: <IoWallet size={16} /> },
        { href: 'https://wa.me/+622129222999', label: 'WhatsApp', icon: <IoLogoWhatsapp size={16} /> },
      ],
    },
  ]

  return (
    <header className="sticky lg:top-8 z-50 h-0">
      {/* Overlay untuk mobile */}
      <div 
        className={`fixed inset-0 bg-gray-900/70 transition-all duration-300 ${
          isNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleNav}
      />

      {/* Container dengan grid untuk logo dan navigation */}
      <div className="container mx-auto bg-white px-6 rounded-lg shadow-lg relative">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" legacyBehavior>
            <a className="flex-shrink-0">
              <Image 
                src="/images/logo.png" 
                alt="Logo" 
                width={180} 
                height={180} 
                className="w-18 h-18 lg:w-24 lg:h-24 object-contain rounded-full invert"
                priority
              />
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center gap-16">
              {navLinks.map((link) => (
                <DesktopNavItem key={link.href} link={link} />
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button (tombol burger) - tampil di sisi kanan */}
          <button 
            className="lg:hidden w-12 h-12 bg-gray-200 text-black rounded-md shadow-md flex items-center justify-center hover:bg-gray-300 transition-colors absolute right-4 top-1/2 -translate-y-1/2"
            onClick={toggleNav}
            aria-label="Open Menu"
          >
            <IoMenuOutline size={18} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`lg:hidden fixed top-0 w-[300px] h-full bg-gray-900 shadow-lg z-50 transition-all duration-300 ease-in-out ${
          isNavOpen ? 'right-0' : '-right-[310px]'
        }`}>
          <div className="flex justify-between items-center p-6">
            <Link href="/" legacyBehavior>
              <a className="flex-shrink-0">
                <Image 
                  src="/images/logo.png" 
                  alt="Logo" 
                  width={60} 
                  height={60} 
                  className="w-15 h-15 object-contain"
                />
              </a>
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
              <MobileNavItem key={link.href} link={link} />
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
