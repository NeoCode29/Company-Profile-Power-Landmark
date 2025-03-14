import Image from 'next/image'
import Link from 'next/link'
import ContactForm from './ContactForm'

const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          {/* Company Info */}
          <div className='flex gap-8'>
            <Link href="/" className="inline-block mb-2 ">
              <Image 
                src="/images/logo.jpg" 
                alt="Power Landmark" 
                width={240} 
                height={240}
                className="rounded-full w-60 overflow-hidden "
              />
            </Link>

            <p className="text-gray-600 mb-8 leading-relaxed max-w-lg text-justify">
              We understand that home, where we spend the most time, is the most comfortable zone for whole family. We are here to fulfill the need for comfortable, elegant and luxurious homes.
            </p>
          </div>

          {/* Contact Info */}

          <div className='justify-items-center'>
            <ContactForm/>
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