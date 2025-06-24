"use client";

import React, { useState } from 'react';
import Carousel from './Carousel';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { FaLeaf, FaTools, FaHome, FaPalette } from 'react-icons/fa';
import { ShoppingCart } from 'lucide-react';

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
  onOrderClick?: () => void;
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

  const handleOrder = () => {
    onOrderClick?.();
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

            {/* Order Button */}
            <button
              onClick={handleOrder}
              className="group flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm"
            >
              <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedServiceCard;