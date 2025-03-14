import React from 'react';
import Carousel from './Carousel'; // Your existing carousel component
import { IoCheckmarkCircleOutline } from 'react-icons/io5';

type AspectRatio = 
  | '1:1'       // Square
  | '4:3'       // Standard
  | '16:9'      // Widescreen
  | '21:9'      // Ultrawide
  | '3:2'       // Classic Photo
  | '9:16'      // Portrait
  | 'custom';   // Custom aspect ratio


type CarouselProps = {
    imageUrls: string[];
    title: string;
    description: string;
    features: string[];
    aspectRatio: AspectRatio;
    interval: number;
    showArrows: boolean;
    showDots: boolean;
    autoPlay: boolean;
    theme?: "light" | "dark"; // Default hanya untuk keamanan
  };

const ServiceCard = ({ 
  imageUrls,
  title,
  description,
  features,
  aspectRatio,
  interval,
  showArrows,
  showDots,
  autoPlay,
  theme = "light" // Default only for theme as a safety fallback
} : CarouselProps) => {
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

  return (
    <div className={`${styles.bg} rounded-lg ${styles.shadow} transition-all duration-300 w-full flex flex-col justify-center p-8 gap-8 h-full`}>
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
          {title}
        </h2>
        <p className={`${styles.subtext} text-lg mb-6 text-justify`}>
          {description}
        </p>
        <ul className="space-y-4 mb-8">
          {features && features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <IoCheckmarkCircleOutline className={`${styles.iconColor} text-xl mt-1`} />
              <span className={`${styles.featureText}`}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceCard;