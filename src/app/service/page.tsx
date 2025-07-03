'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Service from '@/components/Service';
import Footer from '@/components/Footer';

interface ServiceData {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  features: string[];
  images: string[];
  architecturalOptions?: any[];
}

const ServicePage = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        
        if (response.ok) {
          setServices(data.services);
        } else {
          throw new Error('Failed to fetch services');
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
        
        // Fallback data jika API gagal
        setServices([
          {
            id: 'architecture-design',
            title: "Architecture Design",
            description: "We create architectural designs that blend aesthetics with functionality. Each design is uniquely tailored to reflect your personality and lifestyle with a professional touch.",
            price: 150000,
            priceUnit: "Per m²",
            features: [
              "Modern exterior and interior design",
              "Efficient layout planning", 
              "Natural lighting optimization",
              "Eco-friendly concepts"
            ],
            images: [
              '/images/architecture-design/image1.jpg',
              '/images/architecture-design/image2.jpg'
            ]
          },
          {
            id: 'house-construction',
            title: "Private Home Construction",
            description: "Building your dream home with the highest quality standards. We handle every construction detail to ensure perfect results that last for generations.",
            price: 5000000,
            priceUnit: "Per m²",
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
            id: 'villa-construction', 
            title: "Villa Development",
            description: "Creating luxurious villas that combine elegance with comfort. Each villa is meticulously designed to provide a unique living experience in harmony with its surroundings.",
            price: 7500000,
            priceUnit: "Per m²",
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
            id: 'home-renovation',
            title: "Renovation Services", 
            description: "Transforming existing spaces into more modern and functional environments. We help you maximize the potential of your property with innovative design solutions.",
            price: 2000000,
            priceUnit: "Per m²",
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 to-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      <Service services={services} />
      <Footer />
    </div>
  );
};

export default ServicePage;
