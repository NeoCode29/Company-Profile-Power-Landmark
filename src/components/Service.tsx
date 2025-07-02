'use client'
import React, { useState } from 'react';
import EnhancedServiceCard from './EnhancedServiceCard';
import Header from './Header';
import { AnimateInView } from './AnimateInView';
import { prisma } from '@/lib/prisma';
import { Service as ServiceType } from '@prisma/client';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShoppingCart } from 'lucide-react';

interface ServiceData {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  features: string[];
  note?: string;
  freeRevision?: string;
  images: string[];
  architecturalOptions?: {
    id: string;
    name: string;
    price: number;
    size: string;
  }[];
}

interface ServiceProps {
  services: ServiceData[];
}

const Service: React.FC<ServiceProps> = ({ services }) => {
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [areaInput, setAreaInput] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [customPriceInput, setCustomPriceInput] = useState<string>('');
  const [useCustomPrice, setUseCustomPrice] = useState<boolean>(false);
  const { addToCart } = useCart();

  const handleServiceClick = (service: ServiceData) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleOrderClick = (service: ServiceData) => {
    setSelectedService(service);
    setIsOrderDialogOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedService) return;

    let finalPrice = 0;
    let itemName = selectedService.title;
    let itemId = selectedService.id;

    if (selectedService.id === "architecture-design") {
      if (selectedOption === 'custom-area') {
        // Custom luas dengan harga default
        const area = parseInt(areaInput) || 0;
        finalPrice = customPrice * area;
        itemName = `${selectedService.title} - Custom ${area}m²`;
        itemId = `${selectedService.id}-custom-area-${area}`;
      } else if (selectedOption === 'custom-both') {
        // Custom luas dan harga
        const area = parseInt(areaInput) || 0;
        const pricePerM2 = parseInt(customPriceInput) || customPrice;
        finalPrice = pricePerM2 * area;
        itemName = `${selectedService.title} - Custom ${area}m² (${formatPrice(pricePerM2)}/m²)`;
        itemId = `${selectedService.id}-custom-both-${area}-${pricePerM2}`;
      } else {
        // Pilihan 1-4 (paket tetap)
        const selectedOptionData = selectedService.architecturalOptions?.find(opt => opt.name === selectedOption);
        if (selectedOptionData) {
          finalPrice = selectedOptionData.price;
          itemName = `${selectedService.title} - ${selectedOption}`;
          itemId = `${selectedService.id}-${selectedOption}`;
        }
      }
    } else {
      // Layanan lainnya
      const area = parseInt(areaInput) || 0;
      const pricePerM2 = useCustomPrice ? (parseInt(customPriceInput) || selectedService.price) : selectedService.price;
      finalPrice = pricePerM2 * area;
      
      if (useCustomPrice) {
        itemName = `${selectedService.title} - ${area}m² (${formatPrice(pricePerM2)}/m²)`;
        itemId = `${selectedService.id}-custom-${area}-${pricePerM2}`;
      } else {
        itemName = `${selectedService.title} - ${area}m²`;
        itemId = `${selectedService.id}-${area}`;
      }
    }

    addToCart({
      id: itemId,
      name: itemName,
      price: finalPrice,
      quantity: 1,
      image: selectedService.images[0] || '/placeholder-service.png',
      type: 'service'
    });

    // Show success notification
    toast.success('Service added to cart successfully!');

    setIsOrderDialogOpen(false);
    setAreaInput('');
    setSelectedOption('');
    setCustomPriceInput('');
    setUseCustomPrice(false);
  };

  // Get custom pricing option for architectural design
  const getCustomPriceOption = (service: ServiceData) => {
    if (service.id === 'architecture-design' && service.architecturalOptions) {
      return service.architecturalOptions.find(opt => 
        opt.name === 'Architectural Design' && opt.size === 'Per m²'
      );
    }
    return null;
  };

  React.useEffect(() => {
    if (selectedService?.id === 'architecture-design') {
      const customOption = getCustomPriceOption(selectedService);
      if (customOption) {
        setCustomPrice(customOption.price);
      }
    }
  }, [selectedService]);

  // Clear irrelevant fields when option changes
  React.useEffect(() => {
    if (selectedOption !== 'custom-area' && selectedOption !== 'custom-both') {
      setAreaInput('');
      setCustomPriceInput('');
    } else if (selectedOption === 'custom-area') {
      setCustomPriceInput('');
    }
  }, [selectedOption]);

  // Clear custom price input when useCustomPrice checkbox is unchecked
  React.useEffect(() => {
    if (!useCustomPrice) {
      setCustomPriceInput('');
    }
  }, [useCustomPrice]);

  return (
    <>
      <main className="overflow-hidden bg-gradient-to-b from-slate-100 to-white">
        <article>
          {/* Hero Section with Decorative Elements */}
          <section className="py-16 pt-48 relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gray-100 rounded-full filter blur-3xl opacity-30 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gray-200 rounded-full filter blur-3xl opacity-30 -z-10"></div>
            
            <div className="container mx-auto px-4">
              <AnimateInView variant="fade-down" duration={800}>
                <div className="max-w-4xl mx-auto text-center">
                  <div className="mb-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative inline-block">
                      Our Services
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 transform origin-left"></div>
                    </h2>
                    <div className="w-20 h-1 bg-gray-300 mx-auto mt-2"></div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      We provide a range of professional architectural services to help realize your dream home with elegant and functional designs.
                    </p>
                  </div>
                </div>
              </AnimateInView>
            </div>
          </section>

          {/* Service Cards Section */}
          <section className="py-16 relative">
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:grid-rows-2 lg:items-stretch">
                {services.map((service, index) => (
                  <AnimateInView 
                    key={service.id} 
                    variant={index % 2 === 0 ? "fade-right" : "fade-left"} 
                    duration={900} 
                    delay={index * 150}
                  >
                    <div className="h-full">
                      <EnhancedServiceCard 
                        imageUrls={service.images}
                        service={service}
                        aspectRatio="16:9"
                        interval={5000}
                        showArrows={false}
                        showDots={true}
                        autoPlay={true}
                        theme="dark"
                        isArchitectDesign={service.id === "architecture-design"}
                        onOrderClick={() => handleOrderClick(service)}
                      />
                    </div>
                  </AnimateInView>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 relative">
            <div className="container mx-auto px-4">
              <AnimateInView variant="fade-up" duration={800}>
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-xl p-8 md:p-12 flex flex-col items-center justify-center gap-8 transform hover:scale-[1.02] transition-transform duration-300">
                  <div className="text-center">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                      Ready to Realize Your Dream Home?
                    </h2>
                    <p className="text-white text-base md:text-lg mb-6">
                      Consult your needs with our professional team
                    </p>
                    <button className="bg-white text-gray-800 font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-xl">
                      Contact Us
                    </button>
                  </div>
                </div>
              </AnimateInView>
            </div>
          </section>
        </article>
      </main>

      {/* Service Detail Dialog */}
      {selectedService && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedService.title}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-6 space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Pricing Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base Price</span>
                    <span className="font-bold text-green-600">{formatPrice(selectedService.price)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Unit</span>
                    <span className="font-medium">{selectedService.priceUnit}</span>
                  </div>
                  {selectedService.priceUnit.includes('m²') && (
                    <div className="mt-4 p-4 bg-green-50 rounded-md">
                      <p className="text-sm text-green-800">
                        * Price is calculated per square meter. Final price will be based on your project's total area.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedService.features && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">What's Included</h3>
                  <ul className="space-y-2">
                    {selectedService.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsDialogOpen(false);
                    handleOrderClick(selectedService);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Order Dialog */}
      {selectedService && (
        <Dialog open={isOrderDialogOpen} onOpenChange={(open) => {
          setIsOrderDialogOpen(open);
          if (!open) {
            setAreaInput('');
            setSelectedOption('');
            setCustomPriceInput('');
            setUseCustomPrice(false);
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Order {selectedService.title}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-6 space-y-6">
              {selectedService.id === "architecture-design" ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Select Design Type</h3>
                  <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                    {selectedService.architecturalOptions?.filter(opt => opt.name.includes('Architectural Design -')).map((option, index) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.name} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex justify-between w-full">
                          <span>{option.size}</span>
                          <span className="font-semibold text-green-600">{formatPrice(option.price)}</span>
                        </Label>
                      </div>
                    ))}
                                         <div className="flex items-center space-x-2">
                       <RadioGroupItem value="custom-area" id="option-custom-area" />
                       <Label htmlFor="option-custom-area" className="flex justify-between w-full">
                         <span>Custom Area</span>
                         <span className="font-semibold text-green-600">{formatPrice(customPrice)}/m²</span>
                       </Label>
                     </div>
                     <div className="flex items-center space-x-2">
                       <RadioGroupItem value="custom-both" id="option-custom-both" />
                       <Label htmlFor="option-custom-both" className="flex justify-between w-full">
                         <span>Custom Area & Price</span>
                         <span className="font-semibold text-green-600">{formatPrice(customPrice)}/m²</span>
                       </Label>
                     </div>
                  </RadioGroup>
                  
                  {selectedOption === 'custom-area' && (
                                         <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                       <div className="space-y-2">
                         <Label htmlFor="custom-area" className="text-sm font-medium">Area Size (m²)</Label>
                         <input
                           id="custom-area"
                           type="number"
                           value={areaInput}
                           onChange={(e) => setAreaInput(e.target.value)}
                           placeholder="Enter area size"
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                           min="1"
                         />
                       </div>
                       
                       {areaInput && (
                         <div className="bg-green-50 p-3 rounded-lg">
                           <p className="text-sm text-green-800">
                             <strong>Total Price:</strong> {formatPrice((parseInt(areaInput) || 0) * customPrice)}
                           </p>
                         </div>
                       )}
                     </div>
                  )}
                                     {selectedOption === 'custom-both' && (
                     <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                       <div className="space-y-2">
                         <Label htmlFor="custom-area" className="text-sm font-medium">Area Size (m²)</Label>
                         <input
                           id="custom-area"
                           type="number"
                           value={areaInput}
                           onChange={(e) => setAreaInput(e.target.value)}
                           placeholder="Enter area size"
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                           min="1"
                         />
                       </div>
                       
                       <div className="space-y-2">
                         <Label htmlFor="custom-price" className="text-sm font-medium">
                           Price per m² (optional, default: {formatPrice(customPrice)})
                         </Label>
                         <input
                           id="custom-price"
                           type="number"
                           value={customPriceInput}
                           onChange={(e) => setCustomPriceInput(e.target.value)}
                           placeholder={`Default: ${customPrice}`}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                           min="1000"
                         />
                       </div>
                       
                       {areaInput && (
                         <div className="bg-green-50 p-3 rounded-lg">
                           <p className="text-sm text-green-800">
                             <strong>Total Price:</strong> {formatPrice((parseInt(customPriceInput) || customPrice) * parseInt(areaInput) || 0)}
                           </p>
                           <p className="text-xs text-green-600 mt-1">
                             {areaInput}m² × {formatPrice(parseInt(customPriceInput) || customPrice)}/m²
                           </p>
                         </div>
                       )}
                     </div>
                   )}
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Service Details</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">Default Price: {formatPrice(selectedService.price)} {selectedService.priceUnit}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="area" className="text-sm font-medium">Area Size (m²)</Label>
                      <input
                        id="area"
                        type="number"
                        value={areaInput}
                        onChange={(e) => setAreaInput(e.target.value)}
                        placeholder="Enter area size"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        min="1"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="use-custom-price"
                        checked={useCustomPrice}
                        onChange={(e) => setUseCustomPrice(e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <Label htmlFor="use-custom-price" className="text-sm font-medium">
                        Use custom price
                      </Label>
                    </div>

                    {useCustomPrice && (
                      <div className="space-y-2">
                        <Label htmlFor="custom-service-price" className="text-sm font-medium">
                          Price per m² (default: {formatPrice(selectedService.price)})
                        </Label>
                        <input
                          id="custom-service-price"
                          type="number"
                          value={customPriceInput}
                          onChange={(e) => setCustomPriceInput(e.target.value)}
                          placeholder={`Default: ${selectedService.price}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          min="1000"
                        />
                      </div>
                    )}
                    
                    {areaInput && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Total Price:</strong> {formatPrice((useCustomPrice ? (parseInt(customPriceInput) || selectedService.price) : selectedService.price) * parseInt(areaInput) || 0)}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          {areaInput}m² × {formatPrice(useCustomPrice ? (parseInt(customPriceInput) || selectedService.price) : selectedService.price)}/m²
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <DialogFooter>
                <button
                  onClick={() => setIsOrderDialogOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={
                    (selectedService.id === "architecture-design" && !selectedOption) ||
                    (selectedService.id === "architecture-design" && (selectedOption === 'custom-area' || selectedOption === 'custom-both') && !areaInput) ||
                    (selectedService.id === "architecture-design" && selectedOption === 'custom-both' && !customPriceInput) ||
                    (selectedService.id !== "architecture-design" && !areaInput) ||
                    (selectedService.id !== "architecture-design" && useCustomPrice && !customPriceInput)
                  }
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Service; 