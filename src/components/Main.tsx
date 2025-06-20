'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  IoHomeOutline, 
  IoLeafOutline, 
  IoWineOutline, 
  IoShieldCheckmarkOutline, 
  IoArrowForwardOutline, 
  IoBrushOutline,
  IoConstructOutline,
  IoBusinessOutline,
  IoHammerOutline,
  IoChevronForwardOutline
} from 'react-icons/io5'
import Carousel from './Carousel'
import HorizontalImageGallery from './HorizontalImageGallery'
import { AnimateInView } from './AnimateInView'

const Main = () => {
  return (
    <main className="overflow-hidden">
      <article>
        {/* Hero Section */}
        <section className="bg-gray-50 py-24 md:py-24 relative" id="home">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-green-50 opacity-20 clip-diagonal-left"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-100 opacity-20 rounded-tr-3xl"></div>
          
          <div className="container mx-auto px-4 pt-24 relative z-10">
            <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
              {/* Left Column - Content */}
              <AnimateInView variant="fade-right" duration={800}>
                <div className="mb-16 lg:mb-0">
                  <div className="inline-block mb-3 px-4 py-1 bg-green-50 text-green-600 rounded-full font-medium text-sm">
                    Premium Architectural Services
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                    Creating <span className="text-green-600">Elegant Spaces</span> That Define Your Lifestyle
                  </h1>

                  <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-lg">
                    We understand that home is where comfort begins. Our expertise in luxury architecture and design ensures your space reflects both elegance and personal taste.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <a href="#service" className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-all duration-300 font-medium flex items-center justify-center group shadow-md hover:shadow-lg">
                      <span>Explore Our Services</span>
                      <IoArrowForwardOutline className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={18} />
                    </a>
                    
                    <a href="https://wa.me/+622129222999" className="border border-green-200 bg-white text-gray-700 px-6 py-3 rounded-md hover:bg-green-50 transition-all duration-300 font-medium flex items-center justify-center group shadow-sm hover:shadow-md">
                      <span>Get a Free Consultation</span>
                      <IoChevronForwardOutline className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" size={18} />
                    </a>
                  </div>
                </div>
              </AnimateInView>

              {/* Right Column - Image */}
              <AnimateInView variant="fade-left" duration={800} delay={200}>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-full overflow-visible lg:w-[800px]">
                    
                    {/* House image on top */}
                    <div className="relative z-10 flex justify-center">
                      <div className="w-full">
                        <Image
                          src="/images/home.png"
                          alt="Modern house model"
                          width={1600}
                          height={1200}
                          className="w-full lg:w-[600px] mx-auto object-contain hover:scale-105 transition-transform duration-700"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateInView>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 md:py-28 bg-white relative" id="about">
          {/* Decorative grid pattern */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
            <div className="grid grid-cols-6 h-full w-full">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border-r border-gray-900"></div>
              ))}
            </div>
            <div className="grid grid-rows-6 h-full w-full absolute top-0 left-0">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border-b border-gray-900"></div>
              ))}
            </div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 flex justify-center">
            <div className="flex flex-col lg:flex-row items-center gap-16 max-w-5xl">
              {/* Carousel Column */}
              <AnimateInView variant="fade-right" duration={800}>
                <div className="flex-shrink-0 mb-12 lg:mb-0 w-80">
                  <div className="relative">
                    <div className="absolute -top-3 -right-3 w-full h-full border-2 border-green-100 rounded-sm"></div>
                    <Carousel
                      imageUrls={[
                        '/images/about1.jpg',
                        '/images/about2.jpg',
                        '/images/about3.jpg',
                        '/images/about4.jpg',
                        '/images/about5.jpg'
                      ]}
                      aspectRatio="custom"
                      interval={5000}
                      showArrows={false}
                      showDots={true}
                      autoPlay={true}
                      customAspectRatio='2:3'
                    />
                  </div>
                </div>
              </AnimateInView>

              {/* Content Column */}
              <AnimateInView variant="fade-left" duration={800} delay={200}>
                <div className="flex-1">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 relative">
                      Luxury is Attainable, True Elegance is Purposeful
                      <span className="absolute -bottom-3 left-0 w-16 h-1 bg-green-600"></span>
                    </h2>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                      We believe that while price can buy luxury, it cannot buy taste. With us, you get both. Our commitment to excellence in architectural design and construction ensures that every project perfectly matches our client&apos;s lifestyle and luxury aspirations.
                    </p>

                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                      <li className="flex items-start gap-4 group">
                        <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-green-600">
                          <IoHomeOutline className="text-green-600 group-hover:text-white transition-colors" size={24}/>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Luxury Architecture</h3>
                          <p className="text-gray-600 text-sm">Sophisticated designs with premium materials</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start gap-4 group">
                        <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-green-600">
                          <IoLeafOutline className="text-green-600 group-hover:text-white transition-colors" size={24}/>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Eco-Friendly Design</h3>
                          <p className="text-gray-600 text-sm">Sustainable solutions for modern living</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start gap-4 group">
                        <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-green-600">
                          <IoWineOutline className="text-green-600 group-hover:text-white transition-colors" size={24}/>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Premium Quality</h3>
                          <p className="text-gray-600 text-sm">Attention to detail in every aspect</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start gap-4 group">
                        <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-green-600">
                          <IoShieldCheckmarkOutline className="text-green-600 group-hover:text-white transition-colors" size={24}/>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Client Satisfaction</h3>
                          <p className="text-gray-600 text-sm">Exceeding expectations on every project</p>
                        </div>
                      </li>
                    </ul>

                    <Link href="#service" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg group">
                      <span>Our Services</span>
                      <IoArrowForwardOutline className="group-hover:translate-x-1 transition-transform duration-300" size={18} />
                    </Link>
                  </div>
                </div>
              </AnimateInView>
            </div>
          </div>
        </section>

        {/* Service Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white relative" id="service">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 opacity-20 rounded-bl-full"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <AnimateInView variant="fade-up" duration={800}>
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Our Main Focus
                </h2>
                <p className="text-gray-600">We provide comprehensive architectural services with a focus on luxury, functionality, and client satisfaction.</p>
              </div>
            </AnimateInView>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Service Card 1 */}
              <AnimateInView variant="fade-up" duration={800} delay={100}>
                <div className="bg-white rounded-lg shadow-xl p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden group h-[340px] flex flex-col">
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-green-600 transition-all duration-500 group-hover:w-full"></div>
                  
                  <div className="w-16 h-16 bg-green-100 rounded-md flex items-center justify-center mb-6 transition-colors group-hover:bg-green-600">
                    <IoBrushOutline className="text-green-600 text-2xl transition-colors group-hover:text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    <Link href="/service" className="hover:text-green-600 transition-colors">
                      Architecture Design
                    </Link>
                  </h3>

                  <p className="text-gray-600 mb-5">
                    Custom architectural designs that perfectly blend aesthetics with functionality.
                  </p>
                  
                  <div className="mt-auto">
                    <Link href="/service" className="inline-flex items-center text-green-600 group-hover:text-green-700 font-medium transition-colors">
                      <span>Learn more</span>
                      <IoChevronForwardOutline className="ml-1 group-hover:ml-2 transition-all" size={16} />
                    </Link>
                  </div>
                </div>
              </AnimateInView>

              {/* Service Card 2 */}
              <AnimateInView variant="fade-up" duration={800} delay={200}>
                <div className="bg-white rounded-lg shadow-xl p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden group h-[340px] flex flex-col">
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-green-600 transition-all duration-500 group-hover:w-full"></div>
                  
                  <div className="w-16 h-16 bg-green-100 rounded-md flex items-center justify-center mb-6 transition-colors group-hover:bg-green-600">
                    <IoConstructOutline className="text-green-600 text-2xl transition-colors group-hover:text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    <Link href="/service" className="hover:text-green-600 transition-colors">
                      Private Home Construction
                    </Link>
                  </h3>

                  <p className="text-gray-600 mb-5">
                    Building your dream home with attention to every detail and quality.
                  </p>
                  
                  <div className="mt-auto">
                    <Link href="/service" className="inline-flex items-center text-green-600 group-hover:text-green-700 font-medium transition-colors">
                      <span>Learn more</span>
                      <IoChevronForwardOutline className="ml-1 group-hover:ml-2 transition-all" size={16} />
                    </Link>
                  </div>
                </div>
              </AnimateInView>

              {/* Service Card 3 */}
              <AnimateInView variant="fade-up" duration={800} delay={300}>
                <div className="bg-white rounded-lg shadow-xl p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden group h-[340px] flex flex-col">
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-green-600 transition-all duration-500 group-hover:w-full"></div>
                  
                  <div className="w-16 h-16 bg-green-100 rounded-md flex items-center justify-center mb-6 transition-colors group-hover:bg-green-600">
                    <IoBusinessOutline className="text-green-600 text-2xl transition-colors group-hover:text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    <Link href="/service" className="hover:text-green-600 transition-colors">
                      Private Villa Development
                    </Link>
                  </h3>

                  <p className="text-gray-600 mb-5">
                    Luxury villa construction with premium materials and elegant design.
                  </p>
                  
                  <div className="mt-auto">
                    <Link href="/service" className="inline-flex items-center text-green-600 group-hover:text-green-700 font-medium transition-colors">
                      <span>Learn more</span>
                      <IoChevronForwardOutline className="ml-1 group-hover:ml-2 transition-all" size={16} />
                    </Link>
                  </div>
                </div>
              </AnimateInView>

              {/* Service Card 4 */}
              <AnimateInView variant="fade-up" duration={800} delay={400}>
                <div className="bg-white rounded-lg shadow-xl p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden group h-[340px] flex flex-col">
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-green-600 transition-all duration-500 group-hover:w-full"></div>
                  
                  <div className="w-16 h-16 bg-green-100 rounded-md flex items-center justify-center mb-6 transition-colors group-hover:bg-green-600">
                    <IoHammerOutline className="text-green-600 text-2xl transition-colors group-hover:text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    <Link href="/service" className="hover:text-green-600 transition-colors">
                      Renovation Services
                    </Link>
                  </h3>

                  <p className="text-gray-600 mb-5">
                    Transform your existing space into a modern, luxurious environment.
                  </p>
                  
                  <div className="mt-auto">
                    <Link href="/service" className="inline-flex items-center text-green-600 group-hover:text-green-700 font-medium transition-colors">
                      <span>Learn more</span>
                      <IoChevronForwardOutline className="ml-1 group-hover:ml-2 transition-all" size={16} />
                    </Link>
                  </div>
                </div>
              </AnimateInView>
            </div>
          </div>
        </section>

        {/* Project Section */}
        <section className="py-20 md:py-28 bg-gray-50 relative" id="project">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] bg-repeat opacity-5"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <AnimateInView variant="fade-up" duration={800}>
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Featured Projects
                </h2>
                <p className="text-gray-600">Explore our showcase of exceptional architectural designs and completed projects.</p>
              </div>
            </AnimateInView>

            <AnimateInView variant="fade-up" duration={1000} delay={200}>
              <HorizontalImageGallery />
            </AnimateInView>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-32 bg-white opacity-20" style={{ transform: 'skewY(-5deg)', transformOrigin: 'top left' }}></div>
            <div className="absolute bottom-0 right-0 w-full h-32 bg-white opacity-20" style={{ transform: 'skewY(5deg)', transformOrigin: 'bottom right' }}></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <AnimateInView variant="zoom-in" duration={800}>
              <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-lg shadow-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-green-500/20">
                <div className="text-center md:text-left max-w-lg">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                    Ready to Transform Your Space?
                  </h2>
                  <p className="text-white/90 text-base md:text-lg">
                    Let&apos;s collaborate to create the architectural masterpiece you&apos;ve always dreamed of.
                  </p>
                </div>

                <a 
                  href="https://wa.me/+622129222999" 
                  className="bg-white text-gray-900 px-8 py-4 rounded-md font-semibold flex items-center gap-2 hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  <span>Contact Us Today</span>
                  <IoArrowForwardOutline className="group-hover:translate-x-1 transition-transform duration-300" size={18} />
                </a>
              </div>
            </AnimateInView>
          </div>
        </section>
      </article>
      
      <style jsx global>{`
        .clip-diagonal-left {
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
        }
      `}</style>
    </main>
  )
}

export default Main 