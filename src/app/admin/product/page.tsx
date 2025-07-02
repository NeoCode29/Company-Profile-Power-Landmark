import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ProductClient } from './ProductClient';
import { uploadToGoogleDrive, deleteFromGoogleDrive } from '@/lib/googleDrive';

// Force dynamic rendering to ensure fresh data from database
export const dynamic = 'force-dynamic';

async function getProducts() {
  return await prisma.product.findMany({
    include: {
      image: true
    }
  });
}

async function createProduct(formData: FormData): Promise<void> {
  'use server';
  
  const name = formData.get('name') as string;
  const price = parseInt(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string);
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const imageFiles = formData.getAll('images');

  if (!name || !price || !stock || !description || !category) {
    throw new Error('All fields are required');
  }

  if (imageFiles.length > 5) {
    throw new Error('Maximum 5 images allowed');
  }

  try {
    // Upload images to Google Drive
    const imageUrls = await Promise.all(
      imageFiles.map(async (file, index) => {
        if (!(file instanceof File)) {
          throw new Error('Invalid file type');
        }
        const filename = `product-${Date.now()}-${index}-${file.name}`;
        return uploadToGoogleDrive(file, filename);
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
  const imageFiles = formData.getAll('images');
  const existingImages = JSON.parse(formData.get('existingImages') as string) as string[];

  if (!id || !name || !price || !stock || !description || !category) {
    throw new Error('All fields are required');
  }

  if (imageFiles.length + existingImages.length > 5) {
    throw new Error('Maximum 5 images allowed');
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

    // Delete removed images from Google Drive
    const imagesToDelete = currentProduct.image
      .filter(img => !existingImages.includes(img.url))
      .map(img => img.url);

    await Promise.all(
      imagesToDelete.map(url => deleteFromGoogleDrive(url))
    );

    // Upload new images to Google Drive
    const newImageUrls = await Promise.all(
      imageFiles.map(async (file, index) => {
        if (!(file instanceof File)) {
          throw new Error('Invalid file type');
        }
        const filename = `product-${Date.now()}-${index}-${file.name}`;
        return uploadToGoogleDrive(file, filename);
      })
    );

    // Combine existing and new image URLs
    const allImageUrls = [...existingImages, ...newImageUrls];

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

    // Delete images from Google Drive
    await Promise.all(
      product.image.map(img => deleteFromGoogleDrive(img.url))
    );

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
    <ProductClient
      products={products}
      onCreateProduct={createProduct}
      onUpdateProduct={updateProduct}
      onDeleteProduct={deleteProduct}
    />
  );
} 