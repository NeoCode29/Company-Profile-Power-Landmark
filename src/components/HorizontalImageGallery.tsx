import React, { useRef } from 'react';
import Image from 'next/image';

const HorizontalImageGallery = () => {
  const projectImages = [
    { id: 1, imageUrl: '/images/project1.jpg', title: 'Modern Luxury Villa Project' },
    { id: 2, imageUrl: '/images/project2.jpg', title: 'Exclusive Private Residence' },
    { id: 3, imageUrl: '/images/project3.jpg', title: 'Modern Villa Development' },
    { id: 4, imageUrl: '/images/project4.jpg', title: 'Urban Apartment Design' },
    { id: 5, imageUrl: '/images/project5.jpg', title: 'Eco-Friendly Home' },
  ];

  const galleryRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div ref={galleryRef} className="flex overflow-hidden space-x-4 rounded">
        {projectImages.map((project) => (
          <div key={project.id} className="flex-shrink-0 w-80 h-80 relative group overflow-hidden rounded-lg">
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={320}
              height={320}
              className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white font-semibold text-lg">{project.title}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-0 right-0 flex space-x-2 p-2">
        <button onClick={scrollLeft} className="bg-white p-2 w-8 h-8 rounded-full shadow-md flex items-center justify-center">&lt;</button>
        <button onClick={scrollRight} className="bg-white p-2 w-8 h-8 rounded-full shadow-md flex items-center justify-center">&gt;</button>
      </div>
    </div>
  );
};

export default HorizontalImageGallery; 