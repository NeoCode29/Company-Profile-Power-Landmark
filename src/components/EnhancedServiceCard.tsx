"use client";

import React, { useState } from 'react';
import Carousel from './Carousel';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { FaCartPlus, FaShoppingBag } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

type AspectRatio = 
  | '1:1'       // Square
  | '4:3'       // Standard
  | '16:9'      // Widescreen
  | '21:9'      // Ultrawide
  | '3:2'       // Classic Photo
  | '9:16'      // Portrait
  | 'custom';   // Custom aspect ratio

type ServiceInfo = {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit?: string;
  features: string[];
  note?: string;
  freeRevision?: string;
}

type EnhancedServiceCardProps = {
  imageUrls: string[];
  service: ServiceInfo;
  aspectRatio: AspectRatio;
  interval: number;
  showArrows: boolean;
  showDots: boolean;
  autoPlay: boolean;
  theme?: "light" | "dark";
  isArchitectDesign?: boolean;
};

type ArchitectDesignPrice = {
  range: string;
  price: number;
}

const architectPrices: ArchitectDesignPrice[] = [
  { range: "<250M2", price: 100000000 },
  { range: "251-500M2", price: 250000000 },
  { range: "501-1000M2", price: 350000000 },
  { range: ">1001M2", price: 500000000 }
];

const EnhancedServiceCard = ({ 
  imageUrls,
  service,
  aspectRatio,
  interval,
  showArrows,
  showDots,
  autoPlay,
  theme = "light",
  isArchitectDesign = false
} : EnhancedServiceCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [area, setArea] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  // Dynamic styles based on theme
  const themeStyles = {
    light: {
      bg: "bg-white",
      text: "text-gray-900",
      subtext: "text-gray-600",
      featureText: "text-gray-700",
      iconColor: "text-green-600",
      shadow: "shadow-md hover:shadow-lg"
    },
    dark: {
      bg: "bg-gray-800",
      text: "text-white",
      subtext: "text-gray-300",
      featureText: "text-gray-200",
      iconColor: "text-green-400",
      shadow: "shadow-md hover:shadow-lg"
    }
  };

  const styles = themeStyles[theme];

  const handleAddToCart = () => {
    // Implementasi fungsi add to cart
    alert(`Added ${service.title} to cart!`);
  };

  const handleOrder = () => {
    // Implementasi fungsi order
    alert(`Ordered ${service.title}!`);
  };

  const handleSelectArchitectPrice = (price: number, range: string) => {
    setSelectedPrice(price);
    setSelectedRange(range);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  const getTotalPrice = () => {
    if (isArchitectDesign) {
      return selectedPrice || 0;
    } else {
      const areaNum = parseInt(area) || 0;
      return areaNum * service.price;
    }
  };

  return (
    <>
      <div 
        className={`${styles.bg} rounded-lg ${styles.shadow} transition-all duration-300 w-full flex flex-col justify-center p-8 gap-8 h-full cursor-pointer`}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="relative w-70 lg:w-120 mx-auto rounded-md overflow-hidden">
          <Carousel
            imageUrls={imageUrls}
            aspectRatio={aspectRatio}
            interval={interval}
            showArrows={showArrows}
            showDots={showDots}
            autoPlay={autoPlay}
          />
        </div>
        <div className="mb-12 lg:mb-0 flex flex-col justify-center lg:justify-left">
          <h2 className={`text-3xl md:text-4xl font-bold ${styles.text} mb-6`}>
            {service.title}
          </h2>
          <p className={`${styles.subtext} text-lg mb-6 text-justify`}>
            {service.description}
          </p>
          <ul className="space-y-4 mb-8">
            {service.features && service.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <IoCheckmarkCircleOutline className={`${styles.iconColor} text-xl mt-1`} />
                <span className={`${styles.featureText}`}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{service.title}</DialogTitle>
            <DialogDescription className="text-base mt-2">{service.description}</DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-6">
            {isArchitectDesign ? (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Luas Bangunan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {architectPrices.map((price, index) => (
                    <div 
                      key={index} 
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedRange === price.range ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                      onClick={() => handleSelectArchitectPrice(price.price, price.range)}
                    >
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium">{price.range}</span>
                          <span className="font-bold">{formatPrice(price.price)}</span>
                        </div>
                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectArchitectPrice(price.price, price.range);
                            }}
                            className={selectedRange === price.range ? "bg-green-500 text-white hover:bg-green-600" : ""}
                          >
                            {selectedRange === price.range ? "Dipilih" : "Pilih"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {service.note && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold">Note:</h4>
                    <p>{service.note}</p>
                  </div>
                )}
                {service.freeRevision && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold">Free Revisi:</h4>
                    <p>{service.freeRevision}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="area">Luas Area (m²)</Label>
                  <Input 
                    id="area" 
                    type="number" 
                    placeholder="Masukkan luas area" 
                    min="1"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span>Harga per m²</span>
                  <span className="font-semibold">{formatPrice(service.price)}</span>
                </div>
                {service.note && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold">Note:</h4>
                    <p>{service.note}</p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Price:</span>
                <span className="text-xl font-bold text-green-600">{formatPrice(getTotalPrice())}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 mt-6">
            <Button
              variant="outline"
              onClick={handleAddToCart}
              className="flex items-center gap-2"
              disabled={isArchitectDesign ? !selectedPrice : !area}
            >
              <FaCartPlus /> Add to Cart
            </Button>
            <Button
              onClick={handleOrder}
              className="flex items-center gap-2"
              disabled={isArchitectDesign ? !selectedPrice : !area}
            >
              <FaShoppingBag /> Order Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedServiceCard; 