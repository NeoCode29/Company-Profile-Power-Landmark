import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    category: string;
    image: { id: string; url: string }[];
  };
  onView: (product: ProductCardProps['product']) => void;
  onEdit: (product: ProductCardProps['product']) => void;
  onDelete: (productId: string) => void;
}

export function ProductCard({
  product,
  onView,
  onEdit,
  onDelete
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={product.image[0]?.url || '/placeholder-product.png'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 truncate">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-medium">
            ${product.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onView(product)}
        >
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(product)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => onDelete(product.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
} 