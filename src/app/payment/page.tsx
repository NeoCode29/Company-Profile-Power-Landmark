// app/payment/page.tsx
"use client";

import React, { useState } from "react";
import { FaBuilding, FaHome, FaTools, FaUmbrellaBeach, FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

// Define the service type
type Service = {
  name: string;
  price: string;
  unit: string;
  icon: React.ComponentType;
  color: string;
  hoverColor: string;
};

// Services data
const services: Service[] = [
  {
    name: "Architect Services",
    price: "500,000",
    unit: "/m²",
    icon: FaBuilding,
    color: "bg-blue-100 text-blue-600",
    hoverColor: "group-hover:bg-blue-200",
  },
  {
    name: "House Construction",
    price: "5,000,000",
    unit: "/m²",
    icon: FaHome,
    color: "bg-green-100 text-green-600",
    hoverColor: "group-hover:bg-green-200",
  },
  {
    name: "Home Renovation",
    price: "2,000,000",
    unit: "/m²",
    icon: FaTools,
    color: "bg-amber-100 text-amber-600",
    hoverColor: "group-hover:bg-amber-200",
  },
  {
    name: "Villa Construction",
    price: "7,500,000",
    unit: "/m²",
    icon: FaUmbrellaBeach,
    color: "bg-purple-100 text-purple-600",
    hoverColor: "group-hover:bg-purple-200",
  },
];

// Delivery methods
const deliveryMethods = [
  { id: "digital", name: "Digital Delivery" },
  { id: "physical", name: "Physical Delivery" },
  { id: "both", name: "Digital & Physical Delivery" },
];

// Form schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Nama harus minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  phone: z.string().min(10, { message: "Nomor telepon tidak valid" }),
  address: z.string().min(10, { message: "Alamat harus minimal 10 karakter" }),
  service: z.string().min(1, { message: "Pilih layanan" }),
  area: z.coerce.number().min(10, { message: "Luas area minimal 10 m²" }),
  deliveryMethod: z.string().min(1, { message: "Pilih metode pengiriman" }),
  code: z.string().min(6, { message: "Kode harus minimal 6 karakter" }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui syarat dan ketentuan",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function PaymentPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [totalPrice, setTotalPrice] = useState<string>("0");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      service: "",
      area: 0,
      deliveryMethod: "",
      code: "",
      termsAccepted: false,
    },
  });

  const handleServiceChange = (value: string) => {
    const service = services.find((s) => s.name === value);
    if (service) {
      setSelectedService(service);
      calculateTotal(service, form.getValues("area"));
    }
    form.setValue("service", value);
  };

  const calculateTotal = (service: Service, area: number) => {
    const price = parseFloat(service.price.replace(/,/g, ""));
    const total = price * area;
    setTotalPrice(total.toLocaleString("id-ID"));
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    // Here you would typically handle the payment process
    alert("Pembayaran akan diproses. Terima kasih!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Pembayaran Layanan</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section - Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Pembayaran</CardTitle>
                  <CardDescription>
                    Lengkapi detail informasi Anda untuk melanjutkan pembayaran
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nama lengkap" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contoh@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Telepon</FormLabel>
                          <FormControl>
                            <Input placeholder="081234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alamat</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan alamat lengkap" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pilih Layanan</FormLabel>
                          <Select
                            onValueChange={handleServiceChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih layanan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service.name} value={service.name}>
                                  {service.name} - Rp {service.price}{service.unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {selectedService && (
                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Luas Area (m²)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Masukkan luas area"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  calculateTotal(selectedService, parseFloat(e.target.value) || 0);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Tarif {selectedService.name}: Rp {selectedService.price}{selectedService.unit}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="deliveryMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Metode Pengiriman</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih metode pengiriman" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {deliveryMethods.map((method) => (
                                <SelectItem key={method.id} value={method.id}>
                                  {method.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kode Pesanan</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan kode yang dikirim via WhatsApp" {...field} />
                          </FormControl>
                          <FormDescription>
                            Kode diberikan oleh admin setelah negosiasi
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Section - Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Pesanan</CardTitle>
                  <CardDescription>
                    Detail pesanan dan total pembayaran Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedService && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-md ${selectedService.color}`}>
                          {React.createElement(selectedService.icon)}
                        </div>
                        <div>
                          <h3 className="font-medium">{selectedService.name}</h3>
                          <p className="text-sm text-gray-500">Rp {selectedService.price}{selectedService.unit}</p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between">
                          <span>Luas Area:</span>
                          <span>{form.getValues("area") || 0} m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Metode Pengiriman:</span>
                          <span>
                            {deliveryMethods.find(m => m.id === form.getValues("deliveryMethod"))?.name || "-"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Pembayaran:</span>
                          <span>Rp {totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!selectedService && (
                    <div className="text-center py-8 text-gray-500">
                      <p>Pilih layanan untuk melihat ringkasan pesanan</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex-col space-y-4">
                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Saya menyetujui{" "}
                            <Link href="/terms" className="text-blue-600 hover:underline">
                              syarat dan ketentuan
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    className="w-full" 
                    type="submit"
                    disabled={!selectedService || !form.formState.isValid}
                  >
                    Bayar Rp {totalPrice}
                  </Button>
                  
                  <div className="text-center text-sm text-gray-500">
                    <p>Butuh bantuan? <a href="https://wa.me/628123456789" className="text-blue-600 hover:underline flex items-center justify-center gap-1 mt-1">
                      <FaWhatsapp /> Hubungi Admin
                    </a></p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
      
      {/* Policy Information */}
      <div className="mt-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Proses Pemesanan dan Negosiasi</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Pelanggan harus menghubungi admin melalui chat untuk negosiasi dan mencapai kesepakatan atas layanan yang diinginkan. Setelah kesepakatan, admin akan memberikan kode pesanan unik sebagai referensi selama proses pembayaran. Pelanggan wajib mematuhi seluruh ketentuan selama proses pemesanan dan pelayanan.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Kebijakan Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Pembayaran harus dilakukan dalam waktu 30 menit setelah permintaan pembayaran diajukan. Pembayaran dapat dilakukan secara penuh atau melalui down payment (DP) sesuai kesepakatan. Setelah pembayaran diterima, desain akan diserahkan dalam waktu 10 hari dari tanggal pembayaran.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Kebijakan Pengiriman</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Pelaksanaan layanan dimulai hanya setelah desain disetujui oleh pelanggan. Durasi proyek disesuaikan dengan kondisi aktual properti sesuai kesepakatan. Pelanggan harus menyediakan alamat pengiriman yang telah disepakati untuk dokumen atau surat menyurat. Proyek akan diperbarui secara berkala oleh PIC (Person in Charge).
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Kebijakan Pengembalian/Refund</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Pembatalan pesanan harus diajukan secara tertulis ke admin. Refund bisa dinegosiasikan jika pembatalan terjadi sebelum proyek dimulai. Refund umumnya tidak diberikan setelah proyek dimulai kecuali dalam kondisi khusus yang disepakati.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Kebijakan Privasi Data Pelanggan</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Data pribadi (nama, kontak, informasi negosiasi) digunakan hanya untuk pemrosesan pesanan dan penyampaian layanan. Menjamin keamanan dan kerahasiaan data pelanggan. Data tidak dibagikan kepada pihak ketiga tanpa izin, kecuali jika diwajibkan oleh hukum. Pelanggan memiliki hak untuk mengakses, memperbaiki, atau menghapus data pribadi mereka.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Keamanan Transmisi Data Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Transaksi pembayaran dilakukan melalui gateway yang aman dengan teknologi enkripsi terkini (misalnya, PCI DSS). Tidak ada penyimpanan data lengkap kartu pembayaran di sistem setelah transaksi selesai. Gateway pembayaran memenuhi standar keamanan industri.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Ketentuan Tambahan</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Hal-hal yang tidak tercakup dalam perjanjian awal akan diatur melalui addendum yang disepakati bersama. Syarat dan ketentuan dapat diubah atau diperbarui sewaktu-waktu dengan pemberitahuan melalui website atau saluran resmi. Perselisihan akan diselesaikan melalui diskusi secara damai atau melalui jalur hukum jika diperlukan.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kontak</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Untuk pertanyaan atau klarifikasi, pelanggan dapat menghubungi admin melalui informasi kontak yang tersedia di website.
            </p>
            <div className="mt-4">
              <Button variant="outline" className="flex items-center gap-2">
                <FaWhatsapp /> Hubungi Admin via WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}