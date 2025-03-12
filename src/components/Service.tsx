import React from 'react';
import Carousel from './Carousel';
import { 
  IoBrushOutline,
  IoConstructOutline,
  IoBusinessOutline,
  IoHammerOutline,
  IoArrowForwardOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';

const Service: React.FC = () => {
  return (
    <>
      <main>
        <article>
          {/* Hero Section */}
          <section className="bg-gray-100 py-24">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <p className="text-green-600 font-semibold mb-3">Our Services</p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Quality Architectural Services for Your Dream Home
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We provide a range of professional architectural services to help realize your dream home with elegant and functional designs.
                </p>
              </div>
            </div>
          </section>

          {/* Architecture Design Service */}
          <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
                <div className="mb-12 lg:mb-0">
                  <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                    <IoBrushOutline className="text-green-600 text-2xl" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Architecture Design
                  </h2>
                  <p className="text-gray-600 text-lg mb-6">
                    We create architectural designs that blend aesthetics with functionality. Each design is tailored to reflect your personality and lifestyle.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Unique and personal design concepts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Optimal space planning</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Detailed 3D visualization</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Complete technical documentation</span>
                    </li>
                  </ul>
                </div>
                <div className="relative lg:order-2 order-1">
                  <Carousel
                    imageUrls={[
                      '/images/architecture-design/image1.jpg',
                      '/images/architecture-design/image2.jpg'
                    ]}
                    aspectRatio="16:9"
                    interval={5000}
                    showArrows={true}
                    showDots={true}
                    autoPlay={false}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Private Home Construction */}
          <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
                <div className="mb-12 lg:mb-0 order-1">
                  <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                    <IoConstructOutline className="text-green-600 text-2xl" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Private Home Construction
                  </h2>
                  <p className="text-gray-600 text-lg mb-6">
                    Building your dream home with the highest quality standards. We handle every construction detail to ensure perfect results.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Premium quality materials</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Experienced construction team</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Professional project management</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Construction quality assurance</span>
                    </li>
                  </ul>
                </div>
                <div className="relative lg:order-2 order-2">
                  <Carousel
                    imageUrls={[
                      '/images/private-home-construction/image1.jpg',
                      '/images/private-home-construction/image2.jpg',
                      '/images/private-home-construction/image3.jpg',
                      '/images/private-home-construction/image4.jpg',
                      '/images/private-home-construction/image5.jpg'
                    ]}
                    aspectRatio="16:9"
                    interval={5000}
                    showArrows={true}
                    showDots={true}
                    autoPlay={false}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Villa Development */}
          <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
                <div className="mb-12 lg:mb-0">
                  <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                    <IoBusinessOutline className="text-green-600 text-2xl" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Villa Development
                  </h2>
                  <p className="text-gray-600 text-lg mb-6">
                    Creating luxurious villas that combine luxury with comfort. Each villa is designed to provide a unique living experience.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Exclusive villa designs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Premium features and facilities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Beautiful landscaping</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Smart home integration</span>
                    </li>
                  </ul>
                </div>
                <div className="relative lg:order-2 order-2">
                  <Carousel
                    imageUrls={[
                      '/images/private-villa-construction/image1.jpg',
                      '/images/private-villa-construction/image2.jpg',
                      '/images/private-villa-construction/image3.jpg',
                      '/images/private-villa-construction/image4.jpg'
                    ]}
                    aspectRatio="16:9"
                    interval={5000}
                    showArrows={true}
                    showDots={true}
                    autoPlay={false}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Renovation Service */}
          <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
                <div className="mb-12 lg:mb-0 order-1">
                  <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                    <IoHammerOutline className="text-green-600 text-2xl" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Renovation Services
                  </h2>
                  <p className="text-gray-600 text-lg mb-6">
                    Transforming existing spaces into more modern and functional environments. We help you maximize the potential of your property.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Detailed renovation planning</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Creative design solutions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Efficient execution</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IoCheckmarkCircleOutline className="text-green-600 text-xl mt-1" />
                      <span className="text-gray-700">Quality renovation results</span>
                    </li>
                  </ul>
                </div>
                <div className="relative lg:order-2 order-2">
                  <Carousel
                    imageUrls={[
                      '/images/renovation-services/image1.jpg',
                      '/images/renovation-services/image2.jpg',
                      '/images/renovation-services/image3.jpg',
                      '/images/renovation-services/image4.jpg',
                      '/images/renovation-services/image5.jpg',
                      '/images/renovation-services/image6.jpg'
                    ]}
                    aspectRatio="16:9"
                    interval={5000}
                    showArrows={true}
                    showDots={true}
                    autoPlay={false}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-green-50">
            <div className="container mx-auto px-4">
              <div className="bg-green-600 rounded-lg shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                    Ready to Realize Your Dream Home?
                  </h2>
                  <p className="text-white text-base md:text-lg">
                    Consult your needs with our professional team
                  </p>
                </div>
                <a 
                  href="#contact" 
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
    </>
  );
};

export default Service; 