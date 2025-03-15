// import Image from 'next/image'
// import Link from 'next/link'
// import ContactForm from './ContactForm'

// const Footer = () => {
//   return (
//     <footer className="bg-white text-gray-900 py-16">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
//           {/* Company Info */}
//           <div className='flex gap-8'>
//             <Link href="/" className="inline-block mb-2 ">
//               <Image 
//                 src="/images/logo.jpg" 
//                 alt="Power Landmark" 
//                 width={240} 
//                 height={240}
//                 className="rounded-full w-60 overflow-hidden "
//               />
//             </Link>

//             <p className="text-gray-600 mb-8 leading-relaxed max-w-lg text-justify">
//               We understand that home, where we spend the most time, is the most comfortable zone for whole family. We are here to fulfill the need for comfortable, elegant and luxurious homes.
//             </p>
//           </div>

//           {/* Contact Info */}

//           <div className='justify-items-center'>
//             <ContactForm/>
//           </div>
//         </div>

//         {/* Footer Bottom */}
//         <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
//           <p>
//             &copy; {new Date().getFullYear()} <Link href="/" className="text-gray-900 hover:text-green-400 transition-colors">Power Landmark</Link>. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   )
// }

// export default Footer 
"use client";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiPhone, FiGlobe, FiMail, FiMapPin } from 'react-icons/fi';
import ContactForm from './ContactForm';

const Footer = () => {
  const pathname = usePathname();
  const isAboutPage = pathname === '/about';

  return (
    <footer className="bg-white text-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          {/* Company Info & Additional Contact Information */}
          <div className="flex flex-col gap-8">
            <div className="flex gap-8">
              <Link href="/" className="inline-block mb-2">
                <Image 
                  src="/images/logo.jpg" 
                  alt="Power Landmark" 
                  width={240} 
                  height={240}
                  className="rounded-full w-60 overflow-hidden"
                />
              </Link>
              <p className="text-gray-600 leading-relaxed max-w-lg text-justify">
                We understand that home, where we spend the most time, is the most comfortable zone for whole family. We are here to fulfill the need for comfortable, elegant and luxurious homes.
              </p>
            </div>

            {/* Tampilkan informasi kontak tambahan jika bukan halaman /about */}
            {!isAboutPage && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FiPhone className="text-green-400" size={20} />
                    <span>Phone: +62-21-29222999</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiGlobe className="text-green-400" size={20} />
                    <span>
                      Web: <Link href="https://www.cvpowerlandmark.com" className="underline">www.cvpowerlandmark.com</Link>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiMail className="text-green-400" size={20} />
                    <span>
                      Email: <Link href="mailto:cvpowerlandmark@gmail.com" className="underline">cvpowerlandmark@gmail.com</Link>
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FiMapPin className="text-green-400" size={20} />
                    <span>
                      Location:
                      <br />
                      Prominence Office Tower Lt 28 Suite C,
                      <br />
                      Jl Sutera Barat No 15, Alam Sutera,
                      <br />
                      Tangerang, Indonesia
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="justify-items-center">
            <ContactForm/>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/" className="text-gray-900 hover:text-green-400 transition-colors">
              Power Landmark
            </Link>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
