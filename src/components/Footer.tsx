import Image from 'next/image'
import Link from 'next/link'
import { 
  IoLocationOutline, 
  IoCallOutline, 
  IoMailOutline,
  IoGlobeOutline
} from 'react-icons/io5'

const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="inline-block mb-2">
              <Image 
                src="/images/logo.jpg" 
                alt="Power Landmark" 
                width={120} 
                height={120}
                className="w-auto"
              />
            </Link>

            <p className="text-gray-600 mb-8 leading-relaxed max-w-lg">
              We understand that home, where we spend the most time, is the most comfortable zone for whole family. We are here to fulfill the need for comfortable, elegant and luxurious homes.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <IoLocationOutline className="text-green-400 text-xl flex-shrink-0 mt-1" />
                <address className="text-gray-600 not-italic">
                  Prominence Office Tower Lt 28 Suite C<br/>
                  Jl. Sutera Barat No 15, Alam Sutera<br/>
                  Tanggerang, Indonesia
                </address>
              </div>

              <div className="flex items-center gap-3">
                <IoCallOutline className="text-green-400 text-xl flex-shrink-0" />
                <a href="tel:+62-21-29222999" className="text-gray-600 hover:text-green-400 transition-colors">
                  +62-21-29222999
                </a>
              </div>

              <div className="flex items-center gap-3">
                <IoGlobeOutline className="text-green-400 text-xl flex-shrink-0" />
                <a 
                  href="https://www.cvpowerlandmark.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-green-400 transition-colors"
                >
                  www.cvpowerlandmark.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <IoMailOutline className="text-green-400 text-xl flex-shrink-0" />
                <a 
                  href="mailto:cvpowerlandmark@gmail.com" 
                  className="text-gray-600 hover:text-green-400 transition-colors"
                >
                  cvpowerlandmark@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} <Link href="/" className="text-gray-900 hover:text-green-400 transition-colors">Power Landmark</Link>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 