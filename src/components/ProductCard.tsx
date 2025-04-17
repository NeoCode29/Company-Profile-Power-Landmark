import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  stock,
  image
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl group">
      <div className="relative h-64 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
        {stock <= 5 && stock > 0 && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-sm">
            Stok Terbatas: {stock}
          </div>
        )}
        {stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
            Stok Habis
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
          {name}
        </h3>
        <div className="relative">
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
            {description}
          </p>
          {description.length > 100 && (
            <div className="absolute bottom-0 right-0 bg-gradient-to-l from-white via-white to-transparent w-8 h-5"></div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-green-600 font-bold text-lg">
            Rp {formatPrice(price)}
          </span>
          <Link
            href={`/products/${id}`}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 