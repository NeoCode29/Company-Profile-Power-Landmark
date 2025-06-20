'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@prisma/client';
import { ProductDetailDialog } from '@/components/product/ProductDetailDialog';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';

interface ProductWithImages extends Product {
  image: {
    id: string;
    url: string;
    productId: string;
  }[];
}

interface ProductListProps {
  products: ProductWithImages[];
}

export function ProductList({ products }: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductWithImages | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addToCart } = useCart();

  const handleProductClick = (product: ProductWithImages) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent, product: ProductWithImages) => {
    e.stopPropagation(); // Prevent opening the product detail dialog
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image[0]?.url || '',
    });
    toast.success('Product added to cart!');
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
          >
            <div 
              className="relative h-64 overflow-hidden cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              {product.image[0] && (
                <Image
                  src={product.image[0].url}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>
            <div className="p-6">
              <h3 
                className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-green-600"
                onClick={() => handleProductClick(product)}
              >
                {product.name}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}</span>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleProductClick(product)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ProductDetailDialog
          product={selectedProduct}
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setSelectedProduct(null);
          }}
          onAddToCart={(product, quantity) => {
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity,
              image: product.image[0]?.url || '',
            });
            toast.success('Product added to cart!');
          }}
        />
      )}
    </>
  );
} 