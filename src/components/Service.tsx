import React from 'react';
import EnhancedServiceCard from './EnhancedServiceCard';
import PriceListCard from './PriceListCard';
import Header from './Header';

const Service: React.FC = () => {
  const services = [
    {
      id: "architecture-design",
      title: "Architecture Design",
      description: "We create architectural designs that blend aesthetics with functionality. Each design is tailored to reflect your personality and lifestyle.",
      price: 500000,
      priceUnit: "/m²",
      features: [
        "Premium quality materials",
        "Experienced construction team",
        "Professional project management",
        "Construction quality assurance"
      ],
      note: "Sketsa denah konsep dalam 5-7 hari kerja.",
      freeRevision: "Anda akan mendapatkan desain yang original dan lengkap sesuai dengan kebutuhan anda dan dikerjakan oleh tim arsitek, sipil drafter, 3d visual artist yang berpengalaman dan terpercaya sehingga desain yang dihasilkan siap untuk dibangun dengan aman dan hasil jadi rumah sesuai harapan klien.",
      images: [
        '/images/architecture-design/image1.jpg',
        '/images/architecture-design/image2.jpg'
      ]
    },
    {
      id: "private-home-construction",
      title: "Private Home Construction",
      description: "Building your dream home with the highest quality standards. We handle every construction detail to ensure perfect results.",
      price: 5000000,
      priceUnit: "/m²",
      features: [
        "Premium quality materials",
        "Experienced construction team",
        "Professional project management",
        "Construction quality assurance"
      ],
      images: [
        '/images/private-home-construction/image1.jpg',
        '/images/private-home-construction/image2.jpg',
        '/images/private-home-construction/image3.jpg',
        '/images/private-home-construction/image4.jpg',
        '/images/private-home-construction/image5.jpg'
      ]
    },
    {
      id: "villa-development",
      title: "Villa Development",
      description: "Creating luxurious villas that combine luxury with comfort. Each villa is designed to provide a unique living experience.",
      price: 7500000,
      priceUnit: "/m²",
      features: [
        "Exclusive villa designs",
        "Premium features and facilities",
        "Beautiful landscaping",
        "Smart home integration"
      ],
      images: [
        '/images/private-villa-construction/image1.jpg',
        '/images/private-villa-construction/image2.jpg',
        '/images/private-villa-construction/image3.jpg',
        '/images/private-villa-construction/image4.jpg'
      ]
    },
    {
      id: "renovation-services",
      title: "Renovation Services",
      description: "Transforming existing spaces into more modern and functional environments. We help you maximize the potential of your property.",
      price: 2000000,
      priceUnit: "/m²",
      features: [
        "Detailed renovation planning",
        "Creative design solutions",
        "Efficient execution",
        "Quality renovation results"
      ],
      images: [
        '/images/renovation-services/image1.jpg',
        '/images/renovation-services/image2.jpg',
        '/images/renovation-services/image3.jpg',
        '/images/renovation-services/image4.jpg',
        '/images/renovation-services/image5.jpg',
        '/images/renovation-services/image6.jpg'
      ]
    }
  ];

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
                    Our Services
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 transform origin-left"></div>
                  </h2>
                  <div className="w-20 h-1 bg-green-100 mx-auto mt-2"></div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We provide a range of professional architectural services to help realize your dream home with elegant and functional designs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Service Cards Section */}
          <section className="py-16 bg-gray-50 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent"></div>
            <div className='container mx-auto px-4 relative z-10'>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:grid-rows-2 lg:items-start lg:gap-12">
                {services.map((service) => (
                  <EnhancedServiceCard 
                    key={service.id}
                    imageUrls={service.images}
                    service={service}
                  aspectRatio="16:9"
                  interval={5000}
                  showArrows={false}
                  showDots={true}
                  autoPlay={true}
                  theme="dark"
                    isArchitectDesign={service.id === "architecture-design"}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-b from-white to-gray-50 relative">
            <div className="container mx-auto px-4">
              <div className="bg-green-600 rounded-lg shadow-xl p-8 md:p-12 flex flex-col items-center justify-center gap-8 transform hover:scale-[1.02] transition-transform duration-300">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                    Ready to Realize Your Dream Home?
                  </h2>
                  <p className="text-white text-base md:text-lg">
                    Consult your needs with our professional team
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Price List Section */}
          <section className="py-16 bg-gray-50">
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