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
import ServiceCard from './ServiceCard';
import PriceListCard from './PriceListCard';

const Service: React.FC = () => {
  return (
    <>
      <main>
        <article>
          {/* Hero Section */}
          <section className="bg-gray-100 py-24 lg:pt-56">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Quality Architectural Services for Your Dream Home
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We provide a range of professional architectural services to help realize your dream home with elegant and functional designs.
                </p>
              </div>
            </div>
          </section>

          <section className='py-24 bg-white'>
            <div className='container mx-auto px-4'>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:grid-rows-2 lg:items-start  lg:gap-12">
                {/*  */}
                  <ServiceCard 
                    imageUrls={[
                      '/images/architecture-design/image1.jpg',
                      '/images/architecture-design/image2.jpg'
                    ]}
                    title="Architecture Design"
                    description="We create architectural designs that blend aesthetics with functionality. Each design is tailored to reflect your personality and lifestyle."
                    features={[
                      "Premium quality materials",
                      "Experienced construction team",
                      "Professional project management",
                      "Construction quality assurance"
                    ]}
                    aspectRatio="16:9"
                    interval={5000}
                    showArrows={false}
                    showDots={true}
                    autoPlay={true}
                    theme="dark"
                  />

                  <ServiceCard 
                    imageUrls={[
                      '/images/private-home-construction/image1.jpg',
                      '/images/private-home-construction/image2.jpg',
                      '/images/private-home-construction/image3.jpg',
                      '/images/private-home-construction/image4.jpg',
                      '/images/private-home-construction/image5.jpg'
                    ]}
                    title="Private Home Construction"
                    description=" Building your dream home with the highest quality standards. We handle every construction detail to ensure perfect results."
                    features={[
                      "Premium quality materials",
                      "Experienced construction team",
                      "Professional project management",
                      "Construction quality assurance"
                    ]}
                    aspectRatio="16:9"
                    interval={5000}
                    showArrows={false}
                    showDots={true}
                    autoPlay={true}
                    theme="dark"
                  />

                  <ServiceCard 
                    imageUrls={[
                      '/images/private-villa-construction/image1.jpg',
                      '/images/private-villa-construction/image2.jpg',
                      '/images/private-villa-construction/image3.jpg',
                      '/images/private-villa-construction/image4.jpg'
                    ]}
                    title="Villa Development"
                    description="Creating luxurious villas that combine luxury with comfort. Each villa is designed to provide a unique living experience."
                    features={[
                      "Exclusive villa designs",
                      "Premium features and facilities",
                      "Beautiful landscaping",
                      "Smart home integration"
                    ]}
                    aspectRatio="16:9"
                    interval={5000}
                    showArrows={false}
                    showDots={true}
                    autoPlay={true}
                    theme={"dark"}
                  />

                  <ServiceCard 
                    imageUrls={[
                      '/images/renovation-services/image1.jpg',
                      '/images/renovation-services/image2.jpg',
                      '/images/renovation-services/image3.jpg',
                      '/images/renovation-services/image4.jpg',
                      '/images/renovation-services/image5.jpg',
                      '/images/renovation-services/image6.jpg'
                    ]}
                    title="Renovation Services"
                    description="Transforming existing spaces into more modern and functional environments. We help you maximize the potential of your property."
                    features={[
                      "Detailed renovation planning",
                      "Creative design solutions",
                      "Efficient execution",
                      "Quality renovation results"
                    ]}
                    aspectRatio="16:9"
                    interval={5000}
                    showArrows={false}
                    showDots={true}
                    autoPlay={true}
                    theme={"dark"}
                  />
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
                  href="https://wa.me/+622129222999" 
                  className="bg-white text-gray-900 px-8 py-3 rounded font-semibold flex items-center gap-2 hover:bg-gray-900 hover:text-white transition-colors duration-300"
                >
                  <span>Contact Us</span>
                  <IoArrowForwardOutline size={18} />
                </a>
              </div>
            </div>
          </section>


          <section className="py-16 bg-blue-50">
            <div className="container mx-auto px-4">
              <PriceListCard/>
            </div>
          </section>
        </article>
      </main>
    </>
  );
};

export default Service; 