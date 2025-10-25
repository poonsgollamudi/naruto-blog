import React, { useEffect, useState } from 'react'

export default function HeroBackground() {
  const [scrollY, setScrollY] = useState(0)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check if image exists
  useEffect(() => {
    const img = new Image()
    img.onerror = () => setImageError(true)
    img.src = '/images/naruto-vs-sasuke.jpg'
  }, [])

  return (
    <div className="hero-background">
      <div 
        className={`parallax-bg ${imageError ? 'fallback' : ''}`}
        style={{
          transform: `translateY(${scrollY * 0.5}px)`
        }}
      />
      <div className="hero-overlay" />
      {imageError && (
        <div className="image-error">
          ⚠️ Please add naruto-vs-sasuke.jpg to public/images directory
        </div>
      )}
    </div>
  )
}