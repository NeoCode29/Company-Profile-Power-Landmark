import React from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

// Sample product data (in real app, this would come from an API/database)
const products = [
  {
    id: 1,
    name: "Smart Door Lock System",
    description: "Advanced digital door lock with fingerprint and PIN access, perfect for modern homes.",
    price: 2500000,
    stock: 15,
    image: "/images/products/smart-lock.jpg"
  },
  {
    id: 2,
    name: "Solar Panel Kit",
    description: "Complete solar panel system for residential homes, includes installation guide.",
    price: 15000000,
    stock: 8,
    image: "/images/products/solar-panel.jpg"
  },
  {
    id: 3,
    name: "Home Security Camera Set",
    description: "HD security cameras with night vision and mobile app connectivity.",
    price: 4500000,
    stock: 20,
    image: "/images/products/security-camera.jpg"
  },
  {
    id: 4,
    name: "Smart Thermostat",
    description: "Energy-efficient temperature control system with smartphone integration.",
    price: 1800000,
    stock: 12,
    image: "/images/products/thermostat.jpg"
  },
  {
    id: 5,
    name: "Water Filtration System",
    description: "Whole-house water filtration system for clean and safe water.",
    price: 5500000,
    stock: 5,
    image: "/images/products/water-filter.jpg"
  },
  {
    id: 6,
    name: "LED Lighting Package",
    description: "Energy-saving LED lighting set for entire home, includes smart controls.",
    price: 3200000,
    stock: 25,
    image: "/images/products/led-lights.jpg"
  }
];

const ProductsPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white pt-48 relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
          
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative inline-block">
                  Home Products Catalog
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 transform origin-left"></div>
                </h1>
                <div className="w-20 h-1 bg-green-100 mx-auto mt-2"></div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Discover our collection of high-quality home products designed to enhance your living space with modern technology and comfort.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProductsPage; 