"use client"

import { motion } from "framer-motion"
import { Cross, Heart, Users, BookOpen } from "lucide-react"
import { Container } from "@/components/layout/container"
import type { HomeWelcomeSection } from "@/lib/db/services/homepage"

const CARD_ICONS = [Heart, Users, BookOpen]

export function Welcome({ content }: { content: HomeWelcomeSection }) {
  return (
    <section className="pt-6 sm:pt-8 md:pt-12 lg:pt-16 pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-tgm-background">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 text-gray-800">
            {content.heading}
          </h2>
          <div className="mb-6">
            <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-tgm-gold mb-2">
              &ldquo;{content.tagline}&rdquo;
            </blockquote>
            <cite className="text-sm sm:text-base text-gray-600">{content.verse}</cite>
          </div>
        </motion.div>

        {/* Two Horizontal Boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
          {/* First Box - Biblical Foundation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-tgm-gold/10 rounded-full flex items-center justify-center mr-4">
                <BookOpen className="h-6 w-6 text-tgm-gold" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">{content.foundation.title}</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {content.foundation.body}
            </p>
          </motion.div>

          {/* Second Box - Our Mission */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-tgm-gold/10 rounded-full flex items-center justify-center mr-4">
                <Heart className="h-6 w-6 text-tgm-gold" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">{content.missionBox.title}</h3>
            </div>
            {content.missionBox.body.map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
            <p className="font-semibold text-tgm-blue text-lg">
              {content.missionBox.closing}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {content.cards.map((card, index) => {
            const Icon = CARD_ICONS[index % CARD_ICONS.length]
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4 sm:p-6 md:p-8 bg-card rounded-lg shadow-sm"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-tgm-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-tgm-gold" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 text-gray-800">{card.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {card.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Unity Verse Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-12 md:mt-16 text-center"
        >
          <div className="bg-tgm-gold/5 border border-tgm-gold/20 rounded-lg p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
            <Cross className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-tgm-gold mx-auto mb-4 sm:mb-5 md:mb-6" />
            <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800 mb-2 sm:mb-3">
              &ldquo;{content.unityQuote.quote}&rdquo;
            </blockquote>
            <cite className="text-sm sm:text-base text-tgm-gold">{content.unityQuote.reference}</cite>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
