'use client'

import React, { ReactNode } from 'react'
import { useInView } from './useInView'
import { cn } from '@/lib/utils'

export type AnimationVariant = 
  | 'fade-in'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip-up'
  | 'flip-down'

interface AnimateInViewProps {
  children: ReactNode
  className?: string
  variant?: AnimationVariant
  delay?: number
  duration?: number
  threshold?: number
  rootMargin?: string
}

export function AnimateInView({
  children,
  className,
  variant = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.1,
  rootMargin = '0px',
}: AnimateInViewProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold, rootMargin })

  const baseStyles = 'opacity-0'
  
  const variantStyles: Record<AnimationVariant, string> = {
    'fade-in': 'opacity-0',
    'fade-up': 'opacity-0 translate-y-10',
    'fade-down': 'opacity-0 -translate-y-10',
    'fade-left': 'opacity-0 translate-x-10',
    'fade-right': 'opacity-0 -translate-x-10',
    'zoom-in': 'opacity-0 scale-95',
    'zoom-out': 'opacity-0 scale-105',
    'flip-up': 'opacity-0 rotate-x-90',
    'flip-down': 'opacity-0 -rotate-x-90',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all ease-out will-change-transform',
        isInView ? 'opacity-100 transform-none' : variantStyles[variant],
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
} 