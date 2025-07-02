"use client";

import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import { formatPrice } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { ProductActions } from './ProductActions';

// Force dynamic rendering to ensure fresh data from database
export const dynamic = 'force-dynamic';

interface ProductWithImages {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  image: {
    id: string;
    url: string;
    productId: string;
  }[];
}

async function getProduct(id: string): Promise<ProductWithImages | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        image: true
      }
    });
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

interface ProductDetailPageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
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
                  {product.image[0] ? (
                    <Image
                      src={product.image[0].url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                  
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
                  
                  {/* Category */}
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-green-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <div className="prose prose-gray max-w-none mb-8">
                    <p className="text-gray-600 whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>

                  {/* Additional Images */}
                  {product.image.length > 1 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Gambar Lainnya</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {product.image.slice(1, 5).map((img, index) => (
                          <div key={img.id} className="relative h-20 rounded-lg overflow-hidden">
                            <Image
                              src={img.url}
                              alt={`${product.name} ${index + 2}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <ProductActions product={product} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 