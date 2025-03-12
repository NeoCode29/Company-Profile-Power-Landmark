"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface CarouselProps {
  imageUrls: string[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  aspectRatio?: AspectRatio;
  customAspectRatio?: string;
}

// Aspect ratio presets
type AspectRatio = 
  | '1:1'       // Square
  | '4:3'       // Standard
  | '16:9'      // Widescreen
  | '21:9'      // Ultrawide
  | '3:2'       // Classic Photo
  | '9:16'      // Portrait
  | 'custom';   // Custom aspect ratio

const Carousel: React.FC<CarouselProps> = ({
  imageUrls,
  autoPlay = true,
  interval = 3000,
  showArrows = true,
  showDots = true,
  aspectRatio = '16:9',
  customAspectRatio = '', // For custom aspect ratio (e.g., "4:5")
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Calculate the padding-bottom based on aspect ratio
  const getPaddingBottom = (): string => {
    if (aspectRatio === 'custom' && customAspectRatio) {
      const [width, height] = customAspectRatio.split(':').map(Number);
      if (width && height) {
        return `${(height / width) * 100}%`;
      }
    }

    // Preset aspect ratios
    switch (aspectRatio) {
      case '1:1': return '100%';
      case '4:3': return '75%';
      case '16:9': return '56.25%';
      case '21:9': return '42.86%';
      case '3:2': return '66.67%';
      case '9:16': return '177.78%';
      default: return '56.25%'; // Default to 16:9
    }
  };

  // Handle automatic sliding
  useEffect(() => {
    if (!autoPlay || isHovering || imageUrls.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, imageUrls.length, isHovering]);

  // Navigate to the previous slide
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  // Navigate to the next slide
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % imageUrls.length
    );
  };

  // Navigate to a specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle hover state for pausing autoplay
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel container with aspect ratio */}
      <div 
        className="relative w-full" 
        style={{ paddingBottom: getPaddingBottom() }}
      >
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={url}
                alt={`Slide ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && imageUrls.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {showDots && imageUrls.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {imageUrls.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;