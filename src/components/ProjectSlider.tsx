"use client"

// components/AspectRatioSlider.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface SlideItem {
  id: number;
  imageUrl: string;
  title: string;
}

interface AspectRatioSliderProps {
  slides: SlideItem[];
  autoplaySpeed?: number; // dalam milidetik
  showDots?: boolean;
}

const AspectRatioSlider: React.FC<AspectRatioSliderProps> = ({
  slides,
  autoplaySpeed = 5000,
  showDots = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Jarak minimum untuk swipe
  const minSwipeDistance = 50;

  // Fungsi untuk slide ke item berikutnya
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  }, [slides.length]);

  // Fungsi untuk slide ke item sebelumnya
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  }, [slides.length]);

   // Fungsi untuk memulai timer slider
   const startSlideTimer = useCallback(() => {
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current);
    }
    
    slideTimerRef.current = setInterval(() => {
      nextSlide();
    }, autoplaySpeed);
  }, [autoplaySpeed, nextSlide]);

  // Inisialisasi autoplay
  useEffect(() => {
    if (autoplaySpeed > 0) {
      startSlideTimer();
    }
    
    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
      }
    };
  }, [autoplaySpeed, currentIndex, startSlideTimer]);


  // Reset timer ketika user berinteraksi
  const resetSlideTimer = () => {
    if (autoplaySpeed > 0) {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
      }
      startSlideTimer();
    }
  };

  // Handler untuk sentuhan pada layar
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
      resetSlideTimer();
    }
    
    if (isRightSwipe) {
      prevSlide();
      resetSlideTimer();
    }
  };

  // Berpindah ke slide tertentu
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    resetSlideTimer();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Container dengan aspect ratio 1:1 */}
      <div 
        ref={sliderRef}
        className="relative w-full overflow-hidden aspect-square bg-gray-100 rounded-lg shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slide Items */}
        <div className="relative h-full w-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out ${
                index === currentIndex 
                  ? 'translate-x-0 opacity-100 z-10' 
                  : index < currentIndex 
                    ? '-translate-x-full opacity-0 z-0' 
                    : 'translate-x-full opacity-0 z-0'
              }`}
            >
              {/* Gambar dengan aspect ratio 1:1 */}
              <div className="relative w-full h-full">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute"
                />
                {/* Overlay teks */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-white font-semibold text-lg">{slide.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol navigasi */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={() => {
            prevSlide();
            resetSlideTimer();
          }}
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={() => {
            nextSlide();
            resetSlideTimer();
          }}
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indikator posisi slide (dots) */}
      {showDots && (
        <div className="flex justify-center mt-4 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AspectRatioSlider;