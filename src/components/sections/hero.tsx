"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Cross, Play } from "lucide-react"
import Link from "next/link"
import { Container } from "@/components/layout/container"

export function Hero() {
  return (
    <section className="relative py-6 sm:py-8 md:py-12 lg:py-16 overflow-hidden bg-tgm-background">
      {/* Background Video/Image Placeholder */}
      <Container className="relative z-10">
        <div className="bg-gradient-tgm-hero rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 rounded-xl sm:rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl sm:rounded-2xl" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto relative z-10"
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
            TGM
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-4 sm:mb-5 md:mb-6 text-tgm-textmuted"
          >
            The Gospel Mission
          </motion.h2>

          {/* Mission Verse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-6 sm:mb-7 md:mb-8"
          >
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-2">
              &ldquo;Connecting Hearts to His Grace&rdquo;
            </p>
            <p className="text-sm sm:text-base md:text-lg text-tgm-gold">
              Hebrews 4:16
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
          >
            <Button asChild size="default" className="w-full sm:w-auto bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold text-sm sm:text-base">
              <Link href="/about">
                Learn More
              </Link>
            </Button>
            <Button asChild variant="outline" size="default" className="w-full sm:w-auto border-tgm-gold text-tgm-gold hover:bg-tgm-gold hover:text-tgm-blue text-sm sm:text-base">
              <Link href="/sermons">
                <Play className="mr-2 h-4 w-4" />
                Watch Sermons
              </Link>
            </Button>
          </motion.div>
        </motion.div>
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
