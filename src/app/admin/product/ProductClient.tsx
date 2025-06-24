'use client';

import React from 'react';
import { ProductDialog } from '@/components/product/ProductDialog';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  image: { id: string; url: string }[];
}

interface ProductClientProps {
  products: Product[];
  onCreateProduct: (formData: FormData) => Promise<void>;
  onUpdateProduct: (formData: FormData) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
}

export function ProductClient({
  products,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
}: ProductClientProps) {
  const [dialogState, setDialogState] = React.useState<{
    mode: 'create' | 'edit' | 'view';
    open: boolean;
    product?: Product;
  }>({
    mode: 'create',
    open: false
  });

  const handleOpenChange = (open: boolean) => {
    setDialogState(prev => ({ ...prev, open }));
  };

  const handleCreate = () => {
    setDialogState({
      mode: 'create',
      open: true
    });
  };

  const handleView = (product: Product) => {
    setDialogState({
      mode: 'view',
      open: true,
      product
    });
  };

  const handleEdit = (product: Product) => {
    setDialogState({
      mode: 'edit',
      open: true,
      product
    });
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (dialogState.mode === 'create') {
        await onCreateProduct(formData);
      } else if (dialogState.mode === 'edit') {
        await onUpdateProduct(formData);
      }
      handleOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button
          onClick={handleCreate}
          className="bg-green-600 hover:bg-green-700"
        >
          Add New Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={onDeleteProduct}
          />
        ))}
      </div>

      <ProductDialog
        mode={dialogState.mode}
        open={dialogState.open}
        onOpenChange={handleOpenChange}
        product={dialogState.product}
        onSubmit={handleSubmit}
      />
    </div>
  );
} 