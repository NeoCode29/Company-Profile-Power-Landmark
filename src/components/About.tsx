import React from 'react';
import Image from 'next/image';
import { 
  IoHomeOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';
import Header from './Header';

const About: React.FC = () => {
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
                <div className="mb-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative inline-block">
                    About Company
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 transform origin-left"></div>
                  </h2>
                  <div className="w-20 h-1 bg-green-100 mx-auto mt-2"></div>
                </div>
                <div className="relative p-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm">
                  <Image 
                    src="/images/logo.jpg" 
                    alt="Power Landmark" 
                    width={120} 
                    height={120}
                    className="rounded-full mx-auto mb-6 shadow-lg"
                  />
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We truly understand that home, where we spend the most time, is the most comfortable zone for the whole family. We are here to fulfill the need for a comfortable, elegant, and luxurious home. Price can buy luxury but not taste, and with us, you can get both.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Vision and Mission */}
          <section className="py-16 bg-gray-50 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Vision & Mission</h2>
                <div className="w-24 h-1 bg-green-500 mx-auto"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow-xl transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <IoHomeOutline className="text-green-600 text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Vision</h3>
                  <div className="relative px-8 py-4 bg-gray-50 rounded-lg">
                    <div className="absolute top-0 left-0 transform -translate-y-1/2 translate-x-4 w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl font-serif">"</span>
                    </div>
                    <p className="text-lg text-gray-700 text-center italic">
                      Being the best architecture design that matches with client&lsquo;s lifestyle and luxury.
                    </p>
                    <div className="absolute bottom-0 right-0 transform translate-y-1/2 -translate-x-4 w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl font-serif">"</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-xl transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
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
                      <li key={index} className="flex items-start gap-2 group">
                        <span className="text-green-600 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">•</span>
                        <span className="group-hover:text-green-700 transition-colors">{mission}</span>
                      </li>
                    ))}
                  </ul>
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