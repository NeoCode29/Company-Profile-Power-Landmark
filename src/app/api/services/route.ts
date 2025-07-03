import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const dbServices = await prisma.service.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    // Group architectural design services
    const architecturalServices = dbServices.filter(service => 
      service.name.startsWith('Architectural Design')
    );

    // Other services (not architectural design)
    const otherServices = dbServices.filter(service => 
      !service.name.startsWith('Architectural Design')
    );

    // Mapping database data to component structure
    const serviceMapping: Record<string, any> = {
      'House Construction': {
        title: "Private Home Construction",
        description: "Building your dream home with the highest quality standards. We handle every construction detail to ensure perfect results that last for generations.",
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
      'Villa Construction': {
        title: "Villa Development",
        description: "Creating luxurious villas that combine elegance with comfort. Each villa is meticulously designed to provide a unique living experience in harmony with its surroundings.",
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
      'Home Renovation': {
        title: "Renovation Services",
        description: "Transforming existing spaces into more modern and functional environments. We help you maximize the potential of your property with innovative design solutions.",
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
    };

    const services: any[] = [];

    // Add combined architectural design service
    if (architecturalServices.length > 0) {
      services.push({
        id: 'architecture-design',
        title: "Architecture Design",
        description: "We create architectural designs that blend aesthetics with functionality. Each design is uniquely tailored to reflect your personality and lifestyle with a professional touch.",
        price: 0, // Will be determined by selection
        priceUnit: "Various options",
        features: [
          "Modern exterior and interior design",
          "Efficient layout planning", 
          "Natural lighting optimization",
          "Eco-friendly concepts"
        ],
        images: [
          '/images/architecture-design/image1.jpg',
          '/images/architecture-design/image2.jpg'
        ],
        architecturalOptions: architecturalServices
      });
    }

    // Add other services
    otherServices.forEach(service => {
      const mapping = serviceMapping[service.name];
      services.push({
        id: service.name.toLowerCase().replace(/\s+/g, '-'),
        title: mapping?.title || service.name,
        description: mapping?.description || `Professional ${service.name.toLowerCase()} services`,
        price: service.price,
        priceUnit: service.size,
        features: mapping?.features || [`Professional ${service.name.toLowerCase()}`, "Quality assurance", "Expert team"],
        images: mapping?.images || ['/images/services/default.jpg']
      });
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    
    // Return fallback data jika database tidak tersedia
    const fallbackServices = [
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
    ];

    return NextResponse.json({ services: fallbackServices });
  }
} 