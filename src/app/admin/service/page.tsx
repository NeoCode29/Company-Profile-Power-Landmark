import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ServiceClient } from './ServiceClient';

// Force dynamic rendering to ensure fresh data from database
export const dynamic = 'force-dynamic';

async function getServices() {
  return await prisma.service.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}

async function updateServicePrice(formData: FormData): Promise<void> {
  'use server';

  const id = formData.get('id') as string;
  const price = parseInt(formData.get('price') as string);

  if (!id || !price || isNaN(price)) {
    throw new Error('ID service dan harga harus diisi dengan benar');
  }

  if (price < 0) {
    throw new Error('Harga tidak boleh negatif');
  }

  try {
    await prisma.service.update({
      where: { id },
      data: { price }
    });

    revalidatePath('/admin/service');
  } catch (error) {
    console.error('Error updating service price:', error);
    throw new Error('Gagal mengupdate harga service');
  }
}

export default async function ServicePage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const services = await getServices();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kelola Harga Service</h1>
      </div>
      
      <ServiceClient services={services} updateServicePrice={updateServicePrice} />
    </div>
  );
}
