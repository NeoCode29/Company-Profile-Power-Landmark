import React from 'react';
import Image from 'next/image';
import { 
    IoCallOutline, 
    IoGlobeOutline, 
    IoMailOutline, 
    IoLocationOutline, 
    IoLogoWhatsapp 
  } from 'react-icons/io5';

const Contact: React.FC = () => {
  return (
    <main>
      <article>
        {/* Section 1: Company Information */}
        <section className="py-16 bg-white pt-48">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center gap-2">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Contact Company
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    We truly understand that home, where we spend the most time, is the most comfortable zone for the whole family. We are here to fulfill the need for a comfortable, elegant, and luxurious home. Price can buy luxury but not taste, and with us, you can get both.
                </p>
            </div>
          </div>
        </section>

        {/* Section 2: Contact Information with Logo and Description */}
       
        <section className="py-16 bg-gray-100">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Logo and Buttons */}
                    <div className="md:w-1/3 text-center">
                    <Image 
                        src="/images/logo.jpg" 
                        alt="Power Landmark" 
                        width={240} 
                        height={240}
                        className="rounded-full mx-auto"
                    />
                    <div className="flex justify-center gap-4 mt-4">
                        <a 
                        href="https://wa.me/6282129222999" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-400 text-white font-semibold text-sm py-1 px-3 rounded-sm transition duration-300 ease-in-out shadow-md flex-1 max-w-xs"
                        >
                        <IoLogoWhatsapp className="text-xl" />
                        WhatsApp
                        </a>
                        <a 
                        href="tel:+622129222999" 
                        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 text-white font-semibold text-sm py-1 px-3 rounded-sm transition duration-300 ease-in-out shadow-md flex-1 max-w-xs"
                        >
                        <IoCallOutline className="text-xl" />
                        Call
                        </a>
                    </div>
                    </div>
                    {/* Contact Information */}
                    <div className="md:w-2/3">
                    <div className="space-y-6">
                        {/* Phone */}
                        <div className="flex items-start gap-4">
                        <div className="text-green-600 text-2xl">
                            <IoCallOutline />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-lg text-gray-700">+62-21-29222999</p>
                        </div>
                        </div>
                        {/* Web */}
                        <div className="flex items-start gap-4">
                        <div className="text-green-600 text-2xl">
                            <IoGlobeOutline />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Web</p>
                            <p className="text-lg text-gray-700">
                            <a href="https://www.cvpowerlandmark.com" className="text-green-600 hover:underline">
                                www.cvpowerlandmark.com
                            </a>
                            </p>
                        </div>
                        </div>
                        {/* Email */}
                        <div className="flex items-start gap-4">
                        <div className="text-green-600 text-2xl">
                            <IoMailOutline />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-lg text-gray-700">
                            <a href="mailto:admin@cvpowerlandmark.com" className="text-green-600 hover:underline">
                                admin@cvpowerlandmark.com
                            </a>
                            </p>
                        </div>
                        </div>
                        {/* Location */}
                        <div className="flex items-start gap-4">
                        <div className="text-green-600 text-2xl">
                            <IoLocationOutline />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="text-lg text-gray-700">
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

        {/* Section 3: Email Form */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Send Us a Message
              </h2>
              <form 
                action="mailto:admin@cvpowerlandmark.com" 
                method="post" 
                encType="text/plain" 
                className="flex flex-col gap-4"
              >
                <div>
                  <label htmlFor="name" className="block text-gray-700">Name:</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="w-full border border-gray-300 rounded-md p-2" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700">Email:</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="w-full border border-gray-300 rounded-md p-2" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700">Subject:</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    className="w-full border border-gray-300 rounded-md p-2" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700">Message:</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    className="w-full border border-gray-300 rounded-md p-2" 
                    required
                  ></textarea>
                </div>
                <div>
                  <button 
                    type="submit" 
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors w-full"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Contact;
