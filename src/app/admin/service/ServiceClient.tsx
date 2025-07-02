'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Service {
  id: string;
  name: string;
  price: number;
  size: string;
}

interface ServiceClientProps {
  services: Service[];
  updateServicePrice: (formData: FormData) => Promise<void>;
}

export function ServiceClient({ services, updateServicePrice }: ServiceClientProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setEditPrice(service.price);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditPrice(0);
  };

  const handleSubmit = async (serviceId: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('id', serviceId);
      formData.append('price', editPrice.toString());
      
      await updateServicePrice(formData);
      setEditingId(null);
      setEditPrice(0);
    } catch (error) {
      console.error('Error updating service price:', error);
      alert(error instanceof Error ? error.message : 'Gagal mengupdate harga service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card key={service.id} className="p-4">
          <CardHeader>
            <CardTitle className="text-lg">{service.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600">Ukuran/Satuan</Label>
              <p className="font-medium">{service.size}</p>
            </div>
            
            <div>
              <Label className="text-sm text-gray-600">Harga</Label>
              {editingId === service.id ? (
                <div className="space-y-3 mt-2">
                  <Input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                    placeholder="Masukkan harga baru"
                    className="w-full"
                    min="0"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSubmit(service.id)}
                      disabled={isSubmitting}
                      size="sm"
                      className="flex-1"
                    >
                      {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-2">
                  <p className="font-bold text-lg text-green-600">
                    {formatCurrency(service.price)}
                  </p>
                  <Button
                    onClick={() => handleEdit(service)}
                    variant="outline"
                    size="sm"
                  >
                    Edit Harga
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 