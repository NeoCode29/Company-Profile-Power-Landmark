"use client";

import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { formatPrice } from '@/lib/utils';

// Sample product data (in real app, this would come from an API/database)
const products = [
  {
    id: 1,
    name: "Smart Door Lock System",
    description: "Advanced digital door lock with fingerprint and PIN access, perfect for modern homes. Our smart door lock system provides ultimate security and convenience for your home. With features like fingerprint recognition, PIN code access, and mobile app control, you can ensure your home is protected while enjoying easy access. The system also includes emergency key override and low battery warning to prevent any lockout situations. Perfect for modern homes looking to upgrade their security system.",
    price: 2500000,
    stock: 15,
    image: "/images/products/smart-lock.jpg",
  },
  // ... other products
];

const ProductDetailPage = () => {
  const params = useParams();
  const productId = Number(params.id);
  
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-48">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="py-16 pt-48">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Product Image */}
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {/* Stock Badge */}
                  <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-medium
                    ${product.stock > 5 ? 'bg-green-100 text-green-800' : 
                      product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {product.stock > 5 ? 'Tersedia' : 
                     product.stock > 0 ? `Stok Terbatas: ${product.stock}` : 
                     'Stok Habis'}
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                  
                  <div className="mb-6">
                    <span className="text-2xl font-bold text-green-600">
                      Rp {formatPrice(product.price)}
                    </span>
                  </div>

                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex gap-4">
                    <button 
                      className={`flex-1 py-3 px-6 rounded-lg font-medium text-white
                        ${product.stock > 0 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-gray-400 cursor-not-allowed'}`}
                      disabled={product.stock === 0}
                    >
                      Tambah ke Keranjang
                    </button>
                    <button className="flex-1 py-3 px-6 rounded-lg font-medium text-green-600 border-2 border-green-600 hover:bg-green-50">
                      Hubungi Penjual
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProductDetailPage; 