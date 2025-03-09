'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IoHomeOutline, IoLocationOutline, IoCameraOutline, IoFilmOutline, IoBedOutline, IoManOutline, IoSquareOutline, IoResizeOutline, IoHeartOutline, IoAddCircleOutline, IoLeafOutline, IoWineOutline, IoShieldCheckmarkOutline, IoArrowForwardOutline, IoSearchOutline } from 'react-icons/io5'

const Main = () => {
  return (
    <main>
      <article>
        {/* Hero Section */}
        <section className="bg-gray-100 py-2 md:py-24" id="home">
          <div className="container mx-auto px-4">
            <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
              {/* Left Column - Content */}
              <div className="mb-12 lg:mb-0">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-5">
                  <IoHomeOutline size={18}/>
                  <span className="text-sm font-medium">
                    Temukan Hunian Impian Anda
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  Wujudkan Rumah Impian Bersama Power Landmark
                </h1>

                <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
                  Kami membantu Anda menemukan properti sempurna dengan layanan premium dan pilihan properti eksklusif di lokasi strategis.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors duration-300 font-medium flex items-center justify-center">
                    <span>Jelajahi Properti</span>
                    <IoArrowForwardOutline className="ml-2" size={18} />
                  </button>
                  
                  <button className="border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors duration-300 font-medium flex items-center justify-center">
                    <span>Hubungi Kami</span>
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-4">
                  <div>
                    <h3 className="text-2xl font-bold text-orange-600">250+</h3>
                    <p className="text-gray-600 text-sm">Properti Terjual</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-orange-600">100+</h3>
                    <p className="text-gray-600 text-sm">Properti Baru</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-orange-600">10+</h3>
                    <p className="text-gray-600 text-sm">Tahun Pengalaman</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Image and Search */}
              <div className="relative">
                {/* Main Image */}
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
              <figure className="relative mb-12 lg:mb-0">
                <div className="relative">
                  <Image
                    src="/images/about-banner-1.png"
                    alt="House interior"
                    width={500}
                    height={400}
                    className="w-full h-auto rounded-lg"
                  />
                  
                  <div className="absolute -bottom-16 -right-8 hidden md:block">
                    <Image
                      src="/images/about-banner-2.jpg"
                      alt="House interior"
                      width={300}
                      height={200}
                      className="w-64 h-auto rounded-lg shadow-xl"
                    />
                  </div>
                </div>
              </figure>

              <div className="lg:pl-8">
                <p className="text-orange-600 font-semibold mb-4">
                  About Us
                </p>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  The Leading Real Estate Rental Marketplace
                </h2>

                <p className="text-gray-600 mb-8">
                  Over 39,000 people work for us in more than 70 countries all over the This breadth of global coverage,
                  combined with specialist services
                </p>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IoHomeOutline className="text-orange-600" size={20}/>
                    </div>
                    <p className="text-gray-700 font-medium pt-1">Smart Home Design</p>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IoLeafOutline className="text-orange-600" size={20}/>
                    </div>
                    <p className="text-gray-700 font-medium pt-1">Beautiful Scene Around</p>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IoWineOutline className="text-orange-600" size={20}/>
                    </div>
                    <p className="text-gray-700 font-medium pt-1">Exceptional Lifestyle</p>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IoShieldCheckmarkOutline className="text-orange-600" size={20}/>
                    </div>
                    <p className="text-gray-700 font-medium pt-1">Complete 24/7 Security</p>
                  </li>
                </ul>

                <blockquote className="border-l-4 border-orange-600 pl-4 py-2 mb-8 text-gray-600 italic">
                  "Enimad minim veniam quis nostrud exercitation llamco laboris. Lorem ipsum dolor sit amet"
                </blockquote>

                <Link href="#service" className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors duration-300 font-medium">
                  <span>Our Services</span>
                  <IoArrowForwardOutline size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Service Section */}
        <section className="py-16 md:py-24 bg-gray-50" id="service">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-orange-600 font-semibold mb-3">
                Our Services
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Main Focus
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Service Card 1 */}
              <div className="bg-white rounded-lg shadow-md p-8 transition-all duration-300 hover:shadow-lg relative overflow-hidden group">
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-orange-600 transition-all duration-300 group-hover:w-full"></div>
                
                <div className="mb-6">
                  <Image 
                    src="/images/service-1.png" 
                    alt="Buy a home" 
                    width={60} 
                    height={60} 
                    className="w-14 h-14"
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  <Link href="#" className="hover:text-orange-600 transition-colors">
                    Buy a home
                  </Link>
                </h3>

                <p className="text-gray-600 mb-5">
                  Over 1 million+ homes for sale available on the website, we can match you with a house you will want to call home.
                </p>

                <Link href="#" className="flex items-center text-gray-700 font-medium group-hover:text-orange-600 transition-colors">
                  <span>Find A Home</span>
                  <IoArrowForwardOutline className="ml-2" />
                </Link>
              </div>

              {/* Service Card 2 */}
              <div className="bg-white rounded-lg shadow-md p-8 transition-all duration-300 hover:shadow-lg relative overflow-hidden group">
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-orange-600 transition-all duration-300 group-hover:w-full"></div>
                
                <div className="mb-6">
                  <Image 
                    src="/images/service-2.png" 
                    alt="Rent a home" 
                    width={60} 
                    height={60} 
                    className="w-14 h-14"
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  <Link href="#" className="hover:text-orange-600 transition-colors">
                    Rent a home
                  </Link>
                </h3>

                <p className="text-gray-600 mb-5">
                  Over 1 million+ homes for sale available on the website, we can match you with a house you will want to call home.
                </p>

                <Link href="#" className="flex items-center text-gray-700 font-medium group-hover:text-orange-600 transition-colors">
                  <span>Find A Home</span>
                  <IoArrowForwardOutline className="ml-2" />
                </Link>
              </div>

              {/* Service Card 3 */}
              <div className="bg-white rounded-lg shadow-md p-8 transition-all duration-300 hover:shadow-lg relative overflow-hidden group">
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-orange-600 transition-all duration-300 group-hover:w-full"></div>
                
                <div className="mb-6">
                  <Image 
                    src="/images/service-3.png" 
                    alt="Sell a home" 
                    width={60} 
                    height={60} 
                    className="w-14 h-14"
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  <Link href="#" className="hover:text-orange-600 transition-colors">
                    Sell a home
                  </Link>
                </h3>

                <p className="text-gray-600 mb-5">
                  Over 1 million+ homes for sale available on the website, we can match you with a house you will want to call home.
                </p>

                <Link href="#" className="flex items-center text-gray-700 font-medium group-hover:text-orange-600 transition-colors">
                  <span>Find A Home</span>
                  <IoArrowForwardOutline className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Property Section */}
        <section className="py-16 md:py-24 bg-white" id="property">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-orange-600 font-semibold mb-3">
                Properties
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Featured Listings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Property Card 1 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <Image
                    src="/images/property-1.jpg"
                    alt="New Apartment Nice View"
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded">
                    For Rent
                  </span>

                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-white">
                        <IoLocationOutline />
                        <span className="text-sm">Belmont Gardens, Chicago</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="flex items-center gap-1 text-white text-sm">
                          <IoHomeOutline />
                          <span>4</span>
                        </span>
                        <span className="flex items-center gap-1 text-white text-sm">
                          <IoHeartOutline />
                          <span>2</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-orange-600 text-lg font-semibold mb-2">
                    <strong>$34,900</strong>/Month
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <Link href="#" className="hover:text-orange-600 transition-colors">
                      New Apartment Nice View
                    </Link>
                  </h3>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                    Beautiful Huge 1 Family House In Heart Of Westbury. Newly Renovated With New Wood Floors.
                  </p>

                  <ul className="grid grid-cols-3 border-t border-gray-200 pt-6">
                    <li className="flex flex-col items-center">
                      <strong className="text-gray-900 font-semibold">3</strong>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <IoBedOutline />
                        <span>Bedrooms</span>
                      </div>
                    </li>

                    <li className="flex flex-col items-center">
                      <strong className="text-gray-900 font-semibold">2</strong>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <IoManOutline />
                        <span>Bathrooms</span>
                      </div>
                    </li>

                    <li className="flex flex-col items-center">
                      <strong className="text-gray-900 font-semibold">3450</strong>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <IoSquareOutline />
                        <span>Sq Ft</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-between p-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/author.jpg"
                      alt="William Seklo"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="text-gray-900 font-semibold">
                        <Link href="#" className="hover:text-orange-600 transition-colors">
                          William Seklo
                        </Link>
                      </h4>
                      <p className="text-gray-500 text-sm">Estate Agents</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all">
                      <IoHeartOutline size={16} />
                    </button>
                    <button className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all">
                      <IoArrowForwardOutline size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Property Card 2 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <Image
                    src="/images/property-2.jpg"
                    alt="Modern Apartments"
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded">
                    For Sale
                  </span>

                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-white">
                        <IoLocationOutline />
                        <span className="text-sm">Belmont Gardens, Chicago</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="flex items-center gap-1 text-white text-sm">
                          <IoHomeOutline />
                          <span>4</span>
                        </span>
                        <span className="flex items-center gap-1 text-white text-sm">
                          <IoHeartOutline />
                          <span>2</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-orange-600 text-lg font-semibold mb-2">
                    <strong>$30,000</strong>/Month
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <Link href="#" className="hover:text-orange-600 transition-colors">
                      Modern Apartments
                    </Link>
                  </h3>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                    Beautiful Huge 1 Family House In Heart Of Westbury. Newly Renovated With New Wood Floors.
                  </p>

                  <ul className="grid grid-cols-3 border-t border-gray-200 pt-6">
                    <li className="flex flex-col items-center">
                      <strong className="text-gray-900 font-semibold">3</strong>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <IoBedOutline />
                        <span>Bedrooms</span>
                      </div>
                    </li>

                    <li className="flex flex-col items-center">
                      <strong className="text-gray-900 font-semibold">2</strong>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <IoManOutline />
                        <span>Bathrooms</span>
                      </div>
                    </li>

                    <li className="flex flex-col items-center">
                      <strong className="text-gray-900 font-semibold">3450</strong>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <IoSquareOutline />
                        <span>Sq Ft</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-between p-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/author.jpg"
                      alt="William Seklo"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="text-gray-900 font-semibold">
                        <Link href="#" className="hover:text-orange-600 transition-colors">
                          William Seklo
                        </Link>
                      </h4>
                      <p className="text-gray-500 text-sm">Estate Agents</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all">
                      <IoHeartOutline size={16} />
                    </button>
                    <button className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all">
                      <IoArrowForwardOutline size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Property Card 3 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <Image
                    src="/images/property-3.jpg"
                    alt="Comfortable Apartment"
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded">
                    For Rent
                  </span>

                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-white">
                        <IoLocationOutline />
                        <span className="text-sm">Belmont Gardens, Chicago</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="flex items-center gap-1 text-white text-sm">
                          <IoHomeOutline />
                          <span>4</span>
                        </span>
                        <span className="flex items-center gap-1 text-white text-sm">
                          <IoHeartOutline />
                          <span>2</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-orange-600 text-lg font-semibold mb-2">
                    <strong>$28,000</strong>/Month
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <Link href="#" className="hover:text-orange-600 transition-colors">
                      Comfortable Apartment
                    </Link>
                  </h3>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                    Beautiful Huge 1 Family House In Heart Of Westbury. Newly Renovated With New Wood Floors.
                  </p>

                  <ul className="grid grid-cols-3 border-t border-gray-200 pt-6">
                    <li className="flex flex-col items-center">
                      <strong className="text-gray-900 font-semibold">3</strong>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <IoBedOutline />
                        <span>Bedrooms</span>
                      </div>
                    </li>

                    <li className="flex flex-col items-center">
                      <strong className="text-gray-900 font-semibold">2</strong>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <IoManOutline />
                        <span>Bathrooms</span>
                      </div>
                    </li>

                    <li className="flex flex-col items-center">
                      <strong className="text-gray-900 font-semibold">3450</strong>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <IoSquareOutline />
                        <span>Sq Ft</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-between p-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/author.jpg"
                      alt="William Seklo"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="text-gray-900 font-semibold">
                        <Link href="#" className="hover:text-orange-600 transition-colors">
                          William Seklo
                        </Link>
                      </h4>
                      <p className="text-gray-500 text-sm">Estate Agents</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all">
                      <IoHeartOutline size={16} />
                    </button>
                    <button className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all">
                      <IoArrowForwardOutline size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-orange-600 rounded-lg shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                  Looking for a dream home?
                </h2>
                <p className="text-white text-base md:text-lg">
                  We can help you realize your dream of a new home
                </p>
              </div>

              <button className="bg-white text-gray-900 px-8 py-3 rounded font-semibold flex items-center gap-2 hover:bg-gray-900 hover:text-white transition-colors duration-300">
                <span>Explore Properties</span>
                <IoArrowForwardOutline size={18} />
              </button>
            </div>
          </div>
        </section>
      </article>
    </main>
  )
}

export default Main 