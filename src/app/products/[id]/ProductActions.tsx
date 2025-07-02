'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import { ShoppingCart, MessageCircle } from 'lucide-react';

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

interface ProductActionsProps {
  product: ProductWithImages;
}

export function ProductActions({ product }: ProductActionsProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image[0]?.url || '',
        type: 'product'
      });
      toast.success('Produk berhasil ditambahkan ke keranjang!');
    }
  };

  const handleContactSeller = () => {
    // You can customize this to open WhatsApp, email, or other contact methods
    const message = `Halo, saya tertarik dengan produk "${product.name}" dengan harga ${product.price}. Apakah masih tersedia?`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="mt-auto flex gap-4">
      <button 
        className={`flex-1 py-3 px-6 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-colors
          ${product.stock > 0 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-gray-400 cursor-not-allowed'}`}
        disabled={product.stock === 0}
        onClick={handleAddToCart}
      >
        <ShoppingCart className="w-5 h-5" />
        {product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
      </button>
      <button 
        className="flex-1 py-3 px-6 rounded-lg font-medium text-green-600 border-2 border-green-600 hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
        onClick={handleContactSeller}
      >
        <MessageCircle className="w-5 h-5" />
        Hubungi Penjual
      </button>
    </div>
  );
} 