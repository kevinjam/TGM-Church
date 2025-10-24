"use client"

import { motion } from "framer-motion"
import { Cross, Heart, Users, BookOpen } from "lucide-react"
import { Container } from "@/components/layout/container"

export function Welcome() {
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
            THRONE OF GRACE MINISTRIES
          </h2>
          <div className="mb-6">
            <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-tgm-gold mb-2">
              &ldquo;Connecting Hearts to His Grace&rdquo;
            </blockquote>
            <cite className="text-sm sm:text-base text-gray-600">Hebrews 4:16</cite>
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
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">Biblical Foundation</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              At Throne of Grace Ministries, we are honored to walk in the footsteps of biblical brothers 
              who ministered together in unity and purpose—like Peter and Andrew who dropped their nets to 
              follow Christ side by side, James and John whose fiery zeal was refined into humble service, 
              and Moses and Aaron who complemented each other&apos;s gifts to lead God&apos;s people.
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
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">Our Mission</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Just as these brothers partnered in prayer, preaching, and perseverance, our team is united 
              by the same Spirit to boldly approach God&apos;s throne of grace (Hebrews 4:16) and extend 
              His mercy to the world.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Together, we celebrate our differences, cover one another in prayer, and commit to the shared 
              mission of making disciples—because &apos;how good and pleasant it is when brothers dwell 
              together in unity!&apos; (Psalm 133:1).
            </p>
            <p className="font-semibold text-tgm-blue text-lg">
              Join us as we continue this legacy of faithful partnership for God&apos;s glory.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center p-4 sm:p-6 md:p-8 bg-card rounded-lg shadow-sm"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-tgm-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
              <Heart className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-tgm-gold" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 text-gray-800">Our Mission</h3>
            <p className="text-sm sm:text-base text-gray-600">
              To extend God&apos;s mercy to the world and build a community rooted in prayer, 
              unity, and discipleship (Psalm 133:1).
            </p>
          </motion.div>

          {/* Community */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center p-4 sm:p-6 md:p-8 bg-card rounded-lg shadow-sm"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-tgm-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
              <Users className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-tgm-gold" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 text-gray-800">Our Community</h3>
            <p className="text-sm sm:text-base text-gray-600">
              We believe in the power of unity and fellowship. Join us as we grow together 
              in faith and support one another in our spiritual journey.
            </p>
          </motion.div>

          {/* Scripture */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center p-4 sm:p-6 md:p-8 bg-card rounded-lg shadow-sm"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-tgm-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
              <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-tgm-gold" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 text-gray-800">Our Foundation</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Grounded in the Word of God, we seek to live out our faith with authenticity 
              and share the love of Christ with everyone we meet.
            </p>
          </motion.div>
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
              &ldquo;How good and pleasant it is when brothers dwell together in unity!&rdquo;
            </blockquote>
            <cite className="text-sm sm:text-base text-tgm-gold">Psalm 133:1</cite>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
