"use client"

import { motion } from "framer-motion"
import { Cross, Eye, Target, Music, BookOpen, HandHeart, Globe, Users, Heart, type LucideIcon } from "lucide-react"
import { SectionHeader } from "@/components/sections/section-header"
import { ScriptureCard } from "@/components/sections/scripture-card"
import { FocusCard } from "@/components/sections/focus-card"
import { ValueCard } from "@/components/sections/value-card"
import { Container } from "@/components/layout/container"
import type { DnaIcon, OurDnaContent } from "@/lib/db/services/our-dna"

const DNA_ICON_MAP: Record<DnaIcon, LucideIcon> = {
  globe: Globe,
  users: Users,
  music: Music,
  book: BookOpen,
  heart: HandHeart,
}

function HighlightedQuote({ text, highlights }: { text: string; highlights: string[] }) {
  if (highlights.length === 0) return <>{text}</>
  const escaped = highlights.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  const matcher = new RegExp(`(${escaped.join("|")})`, "gi")
  const parts = text.split(matcher)
  const lookup = new Set(highlights.map((word) => word.toLowerCase()))
  return (
    <>
      {parts.map((part, index) =>
        lookup.has(part.toLowerCase()) ? (
          <span
            key={`${part}-${index}`}
            className="bg-gradient-to-r from-tgm-gold to-tgm-lightgold bg-clip-text text-transparent font-bold"
          >
            {part}
          </span>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      )}
    </>
  )
}

export function OurDnaView({ content }: { content: OurDnaContent }) {
  return (
    <div className="min-h-screen bg-gray-200">
      {/* Hero Section */}
      <section className="relative py-24 bg-tgm-background">
        <Container className="relative z-10">
          <div className="bg-gradient-tgm-hero rounded-2xl p-12 md:p-16 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl" />
            
            {/* Decorative elements */}
            <div className="absolute top-8 left-8 w-24 h-24 bg-tgm-gold/10 rounded-full blur-xl" />
            <div className="absolute bottom-8 right-8 w-32 h-32 bg-tgm-gold/5 rounded-full blur-xl" />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-5xl mx-auto relative z-10"
            >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
              className="mb-8"
            >
              <Cross className="h-20 w-20 mx-auto text-tgm-gold" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-6xl md:text-7xl font-bold font-serif mb-6"
            >
              {content.hero.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-2xl md:text-3xl font-light mb-12 text-tgm-textmuted"
            >
              {content.hero.tagline}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
            >
              <blockquote className="text-2xl md:text-3xl font-serif font-medium mb-3">
                &ldquo;{content.hero.quote}&rdquo;
              </blockquote>
              <cite className="text-lg text-tgm-gold">{content.hero.reference}</cite>
            </motion.div>
          </motion.div>
          </div>
        </Container>
      </section>

      {/* Vision Section */}
      <section className="py-20 relative bg-gray-200">
        <Container className="relative z-10">
          <SectionHeader 
            title={content.vision.heading} 
            subtitle={content.vision.subtitle}
            delay={0.1}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-tgm-gold/10 to-tgm-lightgold/10 dark:from-tgm-blue/20 dark:to-tgm-blue/30 rounded-2xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-tgm-gold/5 to-tgm-lightgold/5" />
              <div className="relative z-10">
                <Eye className="h-16 w-16 text-tgm-gold mx-auto mb-8" />
                <blockquote className="text-2xl md:text-3xl font-serif leading-relaxed text-tgm-blue dark:text-tgm-text mb-6">
                  &ldquo;{content.vision.quote}&rdquo;
                </blockquote>
                <div className="w-24 h-1 bg-gradient-to-r from-tgm-gold to-tgm-lightgold mx-auto rounded-full" />
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Biblical Foundation */}
      <section className="py-20 bg-tgm-background">
        <Container>
          <SectionHeader 
            title={content.foundation.heading} 
            subtitle={content.foundation.subtitle}
            delay={0.1}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {content.foundation.scriptures.map((scripture, index) => (
              <ScriptureCard
                key={`${scripture.reference}-${index}`}
                verse={scripture.verse}
                reference={scripture.reference}
                delay={0.2 + index * 0.1}
              />
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-blue-600 dark:text-blue-400">{content.foundation.summaryEmphasis}</span>
                {content.foundation.summaryBody}
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-200">
        <Container>
          <SectionHeader 
            title={content.mission.heading} 
            subtitle={content.mission.subtitle}
            delay={0.1}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-tgm-gold/10 to-tgm-lightgold/10 dark:from-tgm-blue/20 dark:to-tgm-blue/30 rounded-2xl p-12 text-center">
              <Target className="h-16 w-16 text-tgm-gold mx-auto mb-8" />
              <blockquote className="text-2xl md:text-3xl font-serif leading-relaxed text-tgm-blue dark:text-tgm-text">
                &ldquo;<HighlightedQuote text={content.mission.quote} highlights={content.mission.highlights} />&rdquo;
              </blockquote>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Biblical Roots */}
      <section className="py-20 bg-tgm-background">
        <Container>
          <SectionHeader 
            title={content.roots.heading} 
            subtitle={content.roots.subtitle}
            delay={0.1}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.roots.items.map((item, index) => {
              const Icon = DNA_ICON_MAP[item.icon]
              return (
                <motion.div
                  key={`${item.title}-${index}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-tgm-gold to-tgm-lightgold rounded-full flex items-center justify-center">
                      <Icon className="h-6 w-6 text-tgm-blue" />
                    </div>
                    <h3 className="text-xl font-bold font-serif text-tgm-blue">{item.title}</h3>
                  </div>
                  <blockquote className="text-lg font-serif leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <cite className="text-sm font-medium text-tgm-gold italic">
                    {item.reference}
                  </cite>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Focus Areas */}
      <section className="py-20 bg-gray-200">
        <Container>
          <SectionHeader 
            title={content.focus.heading} 
            subtitle={content.focus.subtitle}
            delay={0.1}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.focus.items.map((item, index) => (
              <FocusCard
                key={`${item.title}-${index}`}
                title={item.title}
                verse={item.verse}
                reference={item.reference}
                icon={DNA_ICON_MAP[item.icon]}
                delay={0.2 + index * 0.1}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-tgm-background">
        <Container>
          <SectionHeader 
            title={content.values.heading} 
            subtitle={content.values.subtitle}
            delay={0.1}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.values.items.map((item, index) => (
              <ValueCard
                key={`${item.title}-${index}`}
                title={item.title}
                description={item.description}
                verse={item.verse}
                reference={item.reference}
                delay={0.2 + index * 0.1}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-tgm-background">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-8 text-tgm-blue">
              {content.contact.heading}
            </h2>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
              <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
                <p>
                  <span className="font-semibold text-tgm-gold">Email:</span> {content.contact.email}
                </p>
                <p>
                  <span className="font-semibold text-tgm-gold">Phone:</span> {content.contact.phone}
                </p>
                <p>
                  <span className="font-semibold text-tgm-gold">Address:</span> {content.contact.address}
                </p>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-200 text-gray-800">
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Heart className="h-16 w-16 mx-auto mb-8 text-tgm-gold" />
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-gray-800">
              {content.cta.heading}
            </h2>
            <p className="text-xl mb-8 text-gray-600 leading-relaxed">
              {content.cta.body}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={content.cta.primaryCta.href}
                className="bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold px-8 py-4 rounded-lg font-medium transition-colors text-lg"
              >
                {content.cta.primaryCta.label}
              </a>
              <a
                href={content.cta.secondaryCta.href}
                className="border-2 border-tgm-gold text-tgm-gold hover:bg-tgm-gold hover:text-tgm-blue px-8 py-4 rounded-lg font-medium transition-colors text-lg"
              >
                {content.cta.secondaryCta.label}
              </a>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}
