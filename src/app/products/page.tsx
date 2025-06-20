import React from 'react';
import Header from '@/components/Header';
import { prisma } from '@/lib/prisma';
import { ProductList } from './ProductList';

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      image: true
    }
  });
  return products;
}

export default async function ProductsPage() {
  const products = await getProducts();

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
                  Our Products
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 transform origin-left"></div>
                </h1>
                <div className="w-20 h-1 bg-green-100 mx-auto mt-2"></div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Discover our collection of high-quality products designed to enhance your living space with modern technology and comfort.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <ProductList products={products} />
          </div>
        </section>
      </main>
    </>
  );
} 