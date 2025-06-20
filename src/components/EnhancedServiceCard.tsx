"use client";

import React, { useState } from 'react';
import Carousel from './Carousel';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { FaLeaf, FaTools, FaHome, FaPalette } from 'react-icons/fa';
import { ShoppingCart } from 'lucide-react';
import { Input } from "@/components/ui/input";

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
  onOrderClick?: (area?: number) => void;
};

const EnhancedServiceCard = ({ 
  imageUrls,
  service,
  aspectRatio,
  interval,
  showArrows, // This parameter will be ignored as we'll force arrows to be hidden
  showDots,
  autoPlay,
  theme = "light",
  isArchitectDesign = false,
  onOrderClick
} : EnhancedServiceCardProps) => {
  const [area, setArea] = useState<string>('');

  const handleOrder = () => {
    if (!isArchitectDesign) {
      const areaNumber = parseFloat(area);
      if (areaNumber > 0) {
        onOrderClick?.(areaNumber);
      }
    } else {
      onOrderClick?.();
    }
  };

  // Get service icon based on service id
  const getServiceIcon = () => {
    switch(service.id) {
      case 'architecture-design':
        return <FaPalette className="text-3xl text-gray-300" />;
      case 'private-home-construction':
        return <FaHome className="text-3xl text-gray-300" />;
      case 'villa-development':
        return <FaHome className="text-3xl text-gray-300" />;
      case 'renovation-services':
        return <FaTools className="text-3xl text-gray-300" />;
      default:
        return <FaLeaf className="text-3xl text-gray-300" />;
    }
  };

  return (
    <div className="h-full p-3 md:p-4">
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-xl transition-all duration-300">
        {/* Image Carousel with Rounded Corners */}
        <div className="relative w-full p-3 pt-3 px-3">
          <div className="rounded-lg overflow-hidden">
            <Carousel
              imageUrls={imageUrls}
              aspectRatio={aspectRatio}
              interval={interval}
              showArrows={false} // Always hide arrows
              showDots={showDots}
              autoPlay={true} // Always enable autoplay
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-grow flex flex-col p-5 md:p-6">
          {/* Service Title with Icon */}
          <div className="flex items-center gap-3 mb-4">
            {getServiceIcon()}
            <h2 className="text-2xl font-bold text-white">
              {service.title}
            </h2>
          </div>
          
          {/* Divider */}
          <div className="w-16 h-1 bg-gray-700 rounded-full mb-4"></div>
          
          {/* Description */}
          <p className="text-gray-300 mb-6 leading-relaxed">
            {service.description}
          </p>
          
          {/* Features */}
          <div className="mt-auto">
            <h3 className="text-white text-lg font-semibold mb-3">Key Features</h3>
            <ul className="space-y-3 mb-6">
              {service.features && service.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <IoCheckmarkCircleOutline className="text-gray-400 text-xl mt-1 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Area Input for non-architectural services */}
            {!isArchitectDesign && (
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Enter Area Size (m²)
                </label>
                <Input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Enter area size"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
                />
                {area && (
                  <p className="mt-2 text-sm text-gray-300">
                    Estimated Price: Rp {(service.price * parseFloat(area || '0')).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Order Button */}
            <button
              onClick={handleOrder}
              disabled={!isArchitectDesign && (!area || parseFloat(area) <= 0)}
              className="group flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium">Order Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedServiceCard;