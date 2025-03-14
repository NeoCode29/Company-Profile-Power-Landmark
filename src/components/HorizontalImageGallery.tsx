'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'

interface ProjectImage {
  id: number
  imageUrl: string
  title: string
}

const HorizontalImageGallery: React.FC = () => {
  const projectImages: ProjectImage[] = [
    { id: 1, imageUrl: '/images/project1.jpg', title: 'Modern Luxury Villa Project' },
    { id: 2, imageUrl: '/images/project2.jpg', title: 'Exclusive Private Residence' },
    { id: 3, imageUrl: '/images/project3.jpg', title: 'Modern Villa Development' },
    { id: 4, imageUrl: '/images/project4.jpg', title: 'Urban Apartment Design' },
    { id: 5, imageUrl: '/images/project5.jpg', title: 'Eco-Friendly Home' },
  ]

  const galleryRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeftStart = useRef(0)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true
    startX.current = e.pageX - (galleryRef.current?.offsetLeft || 0)
    scrollLeftStart.current = galleryRef.current?.scrollLeft || 0
    galleryRef.current!.classList.add('cursor-grabbing')
  }

  const handleMouseLeave = () => {
    isDragging.current = false
    galleryRef.current!.classList.remove('cursor-grabbing')
  }

  const handleMouseUp = () => {
    isDragging.current = false
    galleryRef.current!.classList.remove('cursor-grabbing')
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    e.preventDefault()
    const x = e.pageX - (galleryRef.current?.offsetLeft || 0)
    const walk = (x - startX.current) * 1 // dapat disesuaikan kecepatan scroll-nya
    if (galleryRef.current) {
      galleryRef.current.scrollLeft = scrollLeftStart.current - walk
    }
  }

  return (
    <div className="relative">
      <div
        ref={galleryRef}
        className="flex overflow-x-scroll scroll-smooth space-x-4 rounded cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
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
      {/* Tombol panah dapat tetap dipertahankan jika diinginkan,
          namun dengan drag-to-scroll, biasanya perangkat touch sudah mendukung scroll secara native */}
      
    </div>
  )
}

export default HorizontalImageGallery
