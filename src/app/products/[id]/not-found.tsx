import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { ArrowLeft, Search } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="py-16 pt-48">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="bg-white rounded-xl shadow-lg p-12">
              <div className="mb-8">
                <Search className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Produk Tidak Ditemukan
                </h1>
                <p className="text-gray-600 text-lg">
                  Maaf, produk yang Anda cari tidak tersedia atau telah dihapus.
                </p>
              </div>
              
              <div className="space-y-4">
                <Link 
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Kembali ke Produk
                </Link>
                
                <div className="text-gray-500">
                  atau
                </div>
                
                <Link 
                  href="/"
                  className="inline-block text-green-600 hover:text-green-700 font-medium"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 