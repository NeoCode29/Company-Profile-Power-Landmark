'use client'

import { useState, useEffect, useRef, RefObject } from 'react'

type InViewOptions = {
  threshold?: number
  triggerOnce?: boolean
  rootMargin?: string
}

export function useInView<T extends HTMLElement = HTMLElement>(
  options: InViewOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.1, triggerOnce = true, rootMargin = '0px' } = options
  const ref = useRef<T | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current)
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, triggerOnce, rootMargin])

  return [ref, isInView]
} 