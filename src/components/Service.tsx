'use client'
import React, { useState } from 'react';
import EnhancedServiceCard from './EnhancedServiceCard';
import Header from './Header';
import { AnimateInView } from './AnimateInView';
import { prisma } from '@/lib/prisma';
import { Service as ServiceType } from '@prisma/client';
import { formatPrice } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShoppingCart } from 'lucide-react';

interface ServiceData {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  features: string[];
  note?: string;
  freeRevision?: string;
  images: string[];
}

const architecturalOptions = [
  { id: 1, name: 'Under 250m²', price: 100000000 },
  { id: 2, name: '251-500m²', price: 250000000 },
  { id: 3, name: '501-1000m²', price: 350000000 },
  { id: 4, name: 'Above 1000m²', price: 500000000 },
];

const Service: React.FC = () => {
  const services = [
    {
      id: "architecture-design",
      title: "Architecture Design",
      description: "We create architectural designs that blend aesthetics with functionality. Each design is uniquely tailored to reflect your personality and lifestyle with a professional touch.",
      price: 500000,
      priceUnit: "/m²",
      features: [
        "Modern exterior and interior design",
        "Efficient layout planning",
        "Natural lighting optimization",
        "Eco-friendly concepts"
      ],
      note: "Concept floor plan sketches in 5-7 working days.",
      freeRevision: "You will receive original and complete designs tailored to your needs, created by our experienced team of architects, civil drafters, and 3D visual artists. The designs are ready for safe construction, ensuring the finished home meets your expectations.",
      images: [
        '/images/architecture-design/image1.jpg',
        '/images/architecture-design/image2.jpg'
      ]
    },
    {
      id: "private-home-construction",
      title: "Private Home Construction",
      description: "Building your dream home with the highest quality standards. We handle every construction detail to ensure perfect results that last for generations.",
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
      description: "Creating luxurious villas that combine elegance with comfort. Each villa is meticulously designed to provide a unique living experience in harmony with its surroundings.",
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
      description: "Transforming existing spaces into more modern and functional environments. We help you maximize the potential of your property with innovative design solutions.",
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

  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleServiceClick = (service: ServiceData) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleOrderClick = (service: ServiceData, area?: number) => {
    setSelectedService(service);
    if (area) {
      setSelectedOption(area.toString());
    }
    setIsOrderDialogOpen(true);
  };

  const handleOrderSubmit = () => {
    // Handle order submission here
    console.log('Order submitted:', { service: selectedService, option: selectedOption });
    setIsOrderDialogOpen(false);
  };

  return (
    <>
      <Header />
      <main className="overflow-hidden bg-gradient-to-b from-slate-100 to-white">
        <article>
          {/* Hero Section with Decorative Elements */}
          <section className="py-16 pt-48 relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gray-100 rounded-full filter blur-3xl opacity-30 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gray-200 rounded-full filter blur-3xl opacity-30 -z-10"></div>
            
            <div className="container mx-auto px-4">
              <AnimateInView variant="fade-down" duration={800}>
                <div className="max-w-4xl mx-auto text-center">
                  <div className="mb-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative inline-block">
                      Our Services
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 transform origin-left"></div>
                    </h2>
                    <div className="w-20 h-1 bg-gray-300 mx-auto mt-2"></div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      We provide a range of professional architectural services to help realize your dream home with elegant and functional designs.
                    </p>
                  </div>
                </div>
              </AnimateInView>
            </div>
          </section>

          {/* Service Cards Section */}
          <section className="py-16 relative">
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:grid-rows-2 lg:items-stretch">
                {services.map((service, index) => (
                  <AnimateInView 
                    key={service.id} 
                    variant={index % 2 === 0 ? "fade-right" : "fade-left"} 
                    duration={900} 
                    delay={index * 150}
                  >
                    <div className="h-full">
                      <EnhancedServiceCard 
                        imageUrls={service.images}
                        service={service}
                        aspectRatio="16:9"
                        interval={5000}
                        showArrows={false}
                        showDots={true}
                        autoPlay={true}
                        theme="dark"
                        isArchitectDesign={service.id === "architecture-design"}
                        onOrderClick={(area) => handleOrderClick(service, area)}
                      />
                    </div>
                  </AnimateInView>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 relative">
            <div className="container mx-auto px-4">
              <AnimateInView variant="fade-up" duration={800}>
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-xl p-8 md:p-12 flex flex-col items-center justify-center gap-8 transform hover:scale-[1.02] transition-transform duration-300">
                  <div className="text-center">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                      Ready to Realize Your Dream Home?
                    </h2>
                    <p className="text-white text-base md:text-lg mb-6">
                      Consult your needs with our professional team
                    </p>
                    <button className="bg-white text-gray-800 font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-xl">
                      Contact Us
                    </button>
                  </div>
                </div>
              </AnimateInView>
            </div>
          </section>
        </article>
      </main>

      {/* Service Detail Dialog */}
      {selectedService && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedService.title}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-6 space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Pricing Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base Price</span>
                    <span className="font-bold text-green-600">{formatPrice(selectedService.price)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Unit</span>
                    <span className="font-medium">{selectedService.priceUnit}</span>
                  </div>
                  {selectedService.priceUnit.includes('m²') && (
                    <div className="mt-4 p-4 bg-green-50 rounded-md">
                      <p className="text-sm text-green-800">
                        * Price is calculated per square meter. Final price will be based on your project's total area.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedService.features && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">What's Included</h3>
                  <ul className="space-y-2">
                    {selectedService.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsDialogOpen(false);
                    handleOrderClick(selectedService);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Order Now
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Order Dialog */}
      {selectedService && (
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Order {selectedService.title}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-6 space-y-6">
              {selectedService.id === "architecture-design" ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Select Area Size</h3>
                  <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                    {architecturalOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.name} id={`option-${option.id}`} />
                        <Label htmlFor={`option-${option.id}`} className="flex justify-between w-full">
                          <span>{option.name}</span>
                          <span className="font-semibold text-green-600">{formatPrice(option.price)}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Service Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Price: {formatPrice(selectedService.price)} {selectedService.priceUnit}</p>
                  </div>
                </div>
              )}

              <DialogFooter>
                <button
                  onClick={() => setIsOrderDialogOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOrderSubmit}
                  disabled={selectedService.id === "architecture-design" && !selectedOption}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Order
                </button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Service; 