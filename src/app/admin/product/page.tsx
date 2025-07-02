import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ProductClient } from './ProductClient';
import { saveImageToPublic } from '@/services/imageUpload';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering to ensure fresh data from database
export const dynamic = 'force-dynamic';

async function getProducts() {
  return await prisma.product.findMany({
    include: {
      image: true
    }
  });
}

// Delete image from local storage
async function deleteImageSecure(imagePath: string): Promise<void> {
  try {
    // Sanitize path to prevent directory traversal
    const sanitizedPath = imagePath.replace(/^\//, '').replace(/\.\.\//g, '');
    const fullPath = path.join(process.cwd(), 'public', sanitizedPath);

    // Check if file exists
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error('Failed to delete image:', imagePath, error);
    // Don't throw error for delete failures to prevent blocking other operations
  }
}

async function createProduct(formData: FormData): Promise<void> {
  'use server';
  
  const name = formData.get('name') as string;
  const price = parseInt(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string);
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const imageFiles = formData.getAll('images') as File[];

  // Validation
  if (!name || !price || !stock || !description || !category) {
    throw new Error('All fields are required');
  }

  if (imageFiles.length > 5) {
    throw new Error('Maximum 5 images allowed');
  }

  // Validate image files
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  for (const file of imageFiles) {
    if (!(file instanceof File)) {
      throw new Error('Invalid file type');
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed');
    }
    
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB');
    }
  }

  try {
    // Upload images to local storage
    const imageUrls = await Promise.all(
      imageFiles.map(async (file) => {
        return await saveImageToPublic(file, 'products');
      })
    );

    await prisma.product.create({
      data: {
        name,
        price,
        stock,
        description,
        category: category as any,
        image: {
          create: imageUrls.map(url => ({ url }))
        }
      }
    });

    // Revalidate both admin and public product pages
    revalidatePath('/admin/product');
    revalidatePath('/products');
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

async function updateProduct(formData: FormData): Promise<void> {
  'use server';

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const price = parseInt(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string);
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const imageFiles = formData.getAll('images') as File[];
  const existingImages = JSON.parse(formData.get('existingImages') as string) as string[];

  // Validation
  if (!id || !name || !price || !stock || !description || !category) {
    throw new Error('All fields are required');
  }

  if (imageFiles.length + existingImages.length > 5) {
    throw new Error('Maximum 5 images allowed');
  }

  // Validate new image files
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  for (const file of imageFiles) {
    if (!(file instanceof File)) {
      throw new Error('Invalid file type');
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed');
    }
    
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB');
    }
  }

  try {
    // Get current product to find images that will be deleted
    const currentProduct = await prisma.product.findUnique({
      where: { id },
      include: { image: true }
    });

    if (!currentProduct) {
      throw new Error('Product not found');
    }

    // Find images to delete
    const imagesToDelete = currentProduct.image
      .filter(img => !existingImages.includes(img.url))
      .map(img => img.url);

    // Upload new images to local storage
    const newImageUrls = await Promise.all(
      imageFiles.map(async (file) => {
        return await saveImageToPublic(file, 'products');
      })
    );

    // Combine existing and new image URLs
    const allImageUrls = [...existingImages, ...newImageUrls];

    // Update product in database
    await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        stock,
        description,
        category: category as any,
        image: {
          deleteMany: {}, // Remove all existing images from database
          create: allImageUrls.map(url => ({ url }))
        }
      }
    });

    // Delete removed images from local storage (after successful DB update)
    await Promise.all(
      imagesToDelete.map(url => deleteImageSecure(url))
    );

    // Revalidate both admin and public product pages
    revalidatePath('/admin/product');
    revalidatePath('/products');
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

async function deleteProduct(productId: string): Promise<void> {
  'use server';
  
  if (!productId) {
    throw new Error('Product ID is required');
  }

  try {
    // Get product images before deleting
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { image: true }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // First delete all related images from the database
    await prisma.imageProduct.deleteMany({
      where: {
        productId: productId
      }
    });

    // Then delete the product
    await prisma.product.delete({
      where: { id: productId }
    });

    // Delete images from local storage (after successful DB operations)
    await Promise.all(
      product.image.map(img => deleteImageSecure(img.url))
    );

    // Revalidate both admin and public product pages
    revalidatePath('/admin/product');
    revalidatePath('/products');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export default async function ProductPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Products</h1>
      </div>
      
      <ProductClient 
        products={products} 
        onCreateProduct={createProduct}
        onUpdateProduct={updateProduct}
        onDeleteProduct={deleteProduct}
      />
    </div>
  );
} 