"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Cross, Play, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Container } from "@/components/layout/container"
import type { HomeHeroSection } from "@/lib/db/services/homepage"

export function HeroSlider({ hero }: { hero: HomeHeroSection }) {
  const slides = hero.slides
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="relative py-6 sm:py-8 md:py-12 lg:py-16 overflow-hidden bg-tgm-background">
      <Container className="relative z-10">
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden">
          {/* Background Images */}
          <div className="relative h-[400px] sm:h-[450px] md:h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].tagline}
                  fill
                  className="object-cover object-center"
                  priority={currentSlide === 0}
                  quality={90}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center text-center text-white z-10">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto px-4"
              >
                {/* Church Logo/Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mb-4 sm:mb-6 md:mb-8"
                >
                  <Cross className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 mx-auto text-tgm-gold" />
                </motion.div>

                {/* Church Name */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 sm:mb-3 md:mb-4"
                >
                  {slides[currentSlide].title}
                </motion.h1>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-4 sm:mb-5 md:mb-6 text-tgm-textmuted"
                >
                  {slides[currentSlide].subtitle}
                </motion.h2>

                {/* Mission Verse */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mb-6 sm:mb-7 md:mb-8"
                >
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-2">
                    &ldquo;{slides[currentSlide].tagline}&rdquo;
                  </p>
                  <p className="text-sm sm:text-base md:text-lg text-tgm-gold">
                    {slides[currentSlide].verse}
                  </p>
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="text-sm sm:text-base md:text-lg text-tgm-textmuted mb-6 sm:mb-8 max-w-2xl mx-auto"
                >
                  {slides[currentSlide].description}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
                >
                  <Button asChild size="default" className="w-full sm:w-auto bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold text-sm sm:text-base">
                    <Link href={hero.primaryCta.href}>
                      {hero.primaryCta.label}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="default" className="w-full sm:w-auto border-tgm-gold text-tgm-gold hover:bg-tgm-gold hover:text-tgm-blue text-sm sm:text-base">
                    <Link href={hero.secondaryCta.href}>
                      <Play className="mr-2 h-4 w-4" />
                      {hero.secondaryCta.label}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 z-20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 z-20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-tgm-gold'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-tgm-gold/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-tgm-gold/70 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  )
}
