import React from 'react';
import Image from 'next/image';
import { 
    IoCallOutline, 
    IoGlobeOutline, 
    IoMailOutline, 
    IoLocationOutline, 
    IoLogoWhatsapp,
    IoSendOutline
} from 'react-icons/io5';
import Header from './Header';

const Contact: React.FC = () => {
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        <article>
          {/* Hero Section with Decorative Elements */}
          <section className="py-16 bg-gradient-to-b from-gray-50 to-white pt-48 relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
            
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative inline-block">
                  Contact Company
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 transform origin-left"></div>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                  We truly understand that home, where we spend the most time, is the most comfortable zone for the whole family. We are here to fulfill the need for a comfortable, elegant, and luxurious home. Price can buy luxury but not taste, and with us, you can get both.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information Section */}
          <section className="py-16 bg-gray-50 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
                <div className="flex flex-col md:flex-row items-center gap-12">
                  {/* Logo and Buttons */}
                  <div className="md:w-1/3 text-center">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-blue-500/20 rounded-full blur-md"></div>
                      <Image 
                        src="/images/logo.jpg" 
                        alt="Power Landmark" 
                        width={240} 
                        height={240}
                        className="rounded-full mx-auto relative shadow-lg"
                      />
                    </div>
                    <div className="flex justify-center gap-4 mt-6">
                      <a 
                        href="https://wa.me/6282129222999" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 text-white font-semibold text-sm py-2.5 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-200 flex-1 max-w-xs group"
                      >
                        <IoLogoWhatsapp className="text-xl group-hover:scale-110 transition-transform" />
                        WhatsApp
                      </a>
                      <a 
                        href="tel:+622129222999" 
                        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 text-white font-semibold text-sm py-2.5 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-200 flex-1 max-w-xs group"
                      >
                        <IoCallOutline className="text-xl group-hover:scale-110 transition-transform" />
                        Call
                      </a>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="md:w-2/3">
                    <div className="space-y-8">
                      {/* Phone */}
                      <div className="flex items-start gap-4 group p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-green-600 text-2xl p-3 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
                          <IoCallOutline />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-600 mb-1">Phone</p>
                          <p className="text-lg text-gray-700 font-semibold">+62-21-29222999</p>
                        </div>
                      </div>

                      {/* Web */}
                      <div className="flex items-start gap-4 group p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-green-600 text-2xl p-3 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
                          <IoGlobeOutline />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-600 mb-1">Web</p>
                          <a href="https://www.cvpowerlandmark.com" className="text-lg text-gray-700 hover:text-green-600 transition-colors font-semibold">
                            www.cvpowerlandmark.com
                          </a>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-4 group p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-green-600 text-2xl p-3 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
                          <IoMailOutline />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-600 mb-1">Email</p>
                          <a href="mailto:admin@cvpowerlandmark.com" className="text-lg text-gray-700 hover:text-green-600 transition-colors font-semibold">
                            admin@cvpowerlandmark.com
                          </a>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-4 group p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-green-600 text-2xl p-3 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
                          <IoLocationOutline />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-600 mb-1">Location</p>
                          <p className="text-lg text-gray-700 font-semibold">
                            Prominence Office Tower Lt 28 Suite C, Jl Sutera Barat No 15, Alam Sutera, Tangerang, Indonesia
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="py-16 bg-gradient-to-t from-gray-50 to-white relative">
            <div className="container mx-auto px-4">
              <div className="max-w-xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Send Us a Message
                  </h2>
                  <div className="w-20 h-1 bg-green-500 mx-auto"></div>
                </div>
                
                <form 
                  action="mailto:admin@cvpowerlandmark.com" 
                  method="post" 
                  encType="text/plain" 
                  className="space-y-6 bg-white p-8 rounded-2xl shadow-xl"
                >
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name:</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
                      required 
                    />
                  </div>
                  
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
                      required 
                    />
                  </div>
                  
                  <div className="group">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject:</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject" 
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
                      required 
                    />
                  </div>
                  
                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message:</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={4} 
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none" 
                      required
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <span>Send Message</span>
                    <IoSendOutline className="text-xl group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </section>
        </article>
      </main>
    </>
  );
};

export default Contact;
