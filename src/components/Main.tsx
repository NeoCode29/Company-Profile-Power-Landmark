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
} from 'react-icons/io5'
import Carousel from './Carousel'
import HorizontalImageGallery from './HorizontalImageGallery'

const Main = () => {
  return (
    <main>
      <article>
        {/* Hero Section */}
        <section className="bg-gray-100 py-24 md:py-24" id="home">
          <div className="container mx-auto px-4 pt-24">
            <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
              {/* Left Column - Content */}
              <div className="mb-12 lg:mb-0">

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  Creating Elegant Spaces That Define Your Lifestyle
                </h1>

                <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
                  We understand that home is where comfort begins. Our expertise in luxury architecture and design ensures your space reflects both elegance and personal taste.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <a href="#service" className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-300 font-medium flex items-center justify-center">
                    <span>Explore Our Services</span>
                    <IoArrowForwardOutline className="ml-2" size={18} />
                  </a>
                  
                  <a href="https://wa.me/+622129222999" className="border border-green-200 bg-white text-gray-700 px-6 py-3 rounded-md hover:bg-green-50 transition-colors duration-300 font-medium flex items-center justify-center">
                    <span>Get a Free Consultation</span>
                  </a>
                </div>
              </div>

              {/* Right Column - Image */}
              <div className="relative">
                <div className="rounded-lg overflow-hidden mb-16">
                  <Image
                    src="/images/hero-banner.png"
                    alt="Modern house model"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-24 bg-white" id="about">
          <div className="container mx-auto px-4">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12">
              {/* Carousel Column */}
              <div className="mb-12 lg:mb-0 w-80 justify-self-center">
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

              {/* Content Column */}
              <div className=" justify-self-start self-center" >

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Luxury is Attainable, True Elegance is Purposeful
                </h2>

                <p className="text-gray-600 mb-8">
                  We believe that while price can buy luxury, it cannot buy taste. With us, you get both. Our commitment to excellence in architectural design and construction ensures that every project perfectly matches our client&apos;s lifestyle and luxury aspirations.
                </p>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IoHomeOutline className="text-green-600" size={20}/>
                    </div>
                    <p className="text-gray-700 font-medium pt-1">Luxury Architecture Design</p>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IoLeafOutline className="text-green-600" size={20}/>
                    </div>
                    <p className="text-gray-700 font-medium pt-1">Environmental Responsibility</p>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IoWineOutline className="text-green-600" size={20}/>
                    </div>
                    <p className="text-gray-700 font-medium pt-1">Premium Quality Service</p>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IoShieldCheckmarkOutline className="text-green-600" size={20}/>
                    </div>
                    <p className="text-gray-700 font-medium pt-1">Client Satisfaction Guaranteed</p>
                  </li>
                </ul>

                <Link href="#service" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors duration-300 font-medium">
                  <span>Our Services</span>
                  <IoArrowForwardOutline size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Service Section */}
        <section className="py-16 md:py-24 bg-green-50" id="service">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Main Focus
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Service Card 1 */}
              <div className="bg-white rounded-lg shadow-md p-8 transition-all duration-300 hover:shadow-lg relative overflow-hidden group">
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-green-600 transition-all duration-300 group-hover:w-full"></div>
                
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <IoBrushOutline className="text-green-600 text-2xl" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  <Link href="/service" className="hover:text-green-600 transition-colors">
                    Architecture Design
                  </Link>
                </h3>

                <p className="text-gray-600 mb-5">
                  Custom architectural designs that perfectly blend aesthetics with functionality.
                </p>
              </div>

              {/* Service Card 2 */}
              <div className="bg-white rounded-lg shadow-md p-8 transition-all duration-300 hover:shadow-lg relative overflow-hidden group">
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-green-600 transition-all duration-300 group-hover:w-full"></div>
                
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <IoConstructOutline className="text-green-600 text-2xl" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  <Link href="/service" className="hover:text-green-600 transition-colors">
                    Private Home Construction
                  </Link>
                </h3>

                <p className="text-gray-600 mb-5">
                  Building your dream home with attention to every detail and quality.
                </p>
              </div>

              {/* Service Card 3 */}
              <div className="bg-white rounded-lg shadow-md p-8 transition-all duration-300 hover:shadow-lg relative overflow-hidden group">
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-green-600 transition-all duration-300 group-hover:w-full"></div>
                
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <IoBusinessOutline className="text-green-600 text-2xl" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  <Link href="/service" className="hover:text-green-600 transition-colors">
                    Private Villa Development
                  </Link>
                </h3>

                <p className="text-gray-600 mb-5">
                  Luxury villa construction with premium materials and elegant design.
                </p>
              </div>

              {/* Service Card 4 */}
              <div className="bg-white rounded-lg shadow-md p-8 transition-all duration-300 hover:shadow-lg relative overflow-hidden group">
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-green-600 transition-all duration-300 group-hover:w-full"></div>
                
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <IoHammerOutline className="text-green-600 text-2xl" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  <Link href="/service" className="hover:text-green-600 transition-colors">
                    Renovation Services
                  </Link>
                </h3>

                <p className="text-gray-600 mb-5">
                  Transform your existing space into a modern, luxurious environment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Project Section */}
        <section className="py-16 md:py-24 bg-white" id="project">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Featured Projects
              </h2>
            </div>

            <HorizontalImageGallery />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <div className="bg-green-600 rounded-lg shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                  Looking for a dream home?
                </h2>
                <p className="text-white text-base md:text-lg">
                  We can help you realize your dream of a new home
                </p>
              </div>

              <a 
                href="https://wa.me/+622129222999" 
                className="bg-white text-gray-900 px-8 py-3 rounded font-semibold flex items-center gap-2 hover:bg-gray-900 hover:text-white transition-colors duration-300"
              >
                <span>Contact Us</span>
                <IoArrowForwardOutline size={18} />
              </a>
            </div>
          </div>
        </section>
      </article>
    </main>
  )
}

export default Main 