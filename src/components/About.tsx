import React from 'react';
import Image from 'next/image';
import { 
  IoHomeOutline, 
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoGlobeOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';

const About: React.FC = () => {
  return (
    <>
      <main>
        <article>

          {/* Company Information */}
          <section className="py-16 bg-white pt-48">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Company</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We truly understand that home, where we spend the most time, is the most comfortable zone for the whole family. We are here to fulfill the need for a comfortable, elegant, and luxurious home. Price can buy luxury but not taste, and with us, you can get both.
                </p>
              </div>
            </div>
          </section>

          {/* Vision and Mission */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Vision & Mission</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <IoHomeOutline className="text-green-600 text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Vision</h3>
                  <p className="text-lg text-gray-700 text-center">
                    Being the best architecture design that matches with client&lsquo;s lifestyle and luxury.
                  </p>
                </div>
                <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <IoCheckmarkCircleOutline className="text-green-600 text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Mission</h3>
                  <ul className="space-y-3 text-gray-700">
                    {[
                      "Providing satisfaction to every client",
                      "Implementing good corporate governance",
                      "Providing value-added service and solutions in the field of architectural services",
                      "Providing convenience, certainty, quality, and innovation in architectural services",
                      "Creating the best conditions as a place of pride to work and achieve",
                      "Increasing concern and responsibility for the environment and society",
                      "Always improving the quality of human resources, products, and services"
                    ].map((mission, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 flex-shrink-0 mt-1">•</span>
                        <span>{mission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Contact Us</h2>
              </div>
              <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 flex flex-col md:flex-row gap-12 justify-center items-center">
                <Image 
                  src="/images/logo.jpg" 
                  alt="Power Landmark" 
                  width={240} 
                  height={240}
                  className=" w-60 overflow-hidden "
                />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <IoCallOutline className="text-green-600 text-xl" />
                    </div>
                    <p className="text-lg text-gray-700">
                      <strong>Phone:</strong> +62-21-29222999
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <IoGlobeOutline className="text-green-600 text-xl" />
                    </div>
                    <p className="text-lg text-gray-700">
                      <strong>Web:</strong> <a href="https://www.cvpowerlandmark.com" className="text-green-600 hover:underline">www.cvpowerlandmark.com</a>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <IoMailOutline className="text-green-600 text-xl" />
                    </div>
                    <p className="text-lg text-gray-700">
                      <strong>Email:</strong> <a href="mailto:cvpowerlandmark@gmail.com" className="text-green-600 hover:underline">cvpowerlandmark@gmail.com</a>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IoLocationOutline className="text-green-600 text-xl" />
                    </div>
                    <p className="text-lg text-gray-700">
                      <strong>Location:</strong><br />
                      Prominence Office Tower Lt 28 Suite C,<br />
                      Jl Sutera Barat No 15, Alam Sutera,<br />
                      Tangerang, Indonesia
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
    </>
  );
};

export default About; 