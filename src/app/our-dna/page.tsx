"use client"

import { motion } from "framer-motion"
import { Cross, Eye, Target, Music, BookOpen, HandHeart, Globe, Users, Heart } from "lucide-react"
import { SectionHeader } from "@/components/sections/section-header"
import { ScriptureCard } from "@/components/sections/scripture-card"
import { FocusCard } from "@/components/sections/focus-card"
import { ValueCard } from "@/components/sections/value-card"
import { Container } from "@/components/layout/container"

export default function OurDNA() {
  return (
    <div className="min-h-screen">
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
              Our DNA
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-2xl md:text-3xl font-light mb-12 text-tgm-textmuted"
            >
              Rooted in Grace. Living for His Glory.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
            >
              <blockquote className="text-2xl md:text-3xl font-serif font-medium mb-3">
                &ldquo;Connecting Hearts to His Grace&rdquo;
              </blockquote>
              <cite className="text-lg text-tgm-gold">Hebrews 4:16</cite>
            </motion.div>
          </motion.div>
          </div>
        </Container>
      </section>

      {/* Vision Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-tgm-background/50 to-transparent" />
        <Container className="relative z-10">
          <SectionHeader 
            title="Vision" 
            subtitle="Our God-given vision for the future"
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
                  &ldquo;To see a generation boldly dwelling in God&apos;s presence, transformed by grace, 
                  and advancing His Kingdom in every sphere of life.&rdquo;
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
            title="Biblical Foundation" 
            subtitle="Our faith is built on the solid rock of God's Word"
            delay={0.1}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <ScriptureCard
              verse="Therefore, since we have confidence to enter the Most Holy Place by the blood of Jesus... let us draw near to God."
              reference="Hebrews 10:19, 22"
              delay={0.2}
            />
            <ScriptureCard
              verse="Your kingdom come, Your will be done on earth as it is in heaven."
              reference="Matthew 6:10"
              delay={0.3}
            />
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
                <span className="font-semibold text-blue-600 dark:text-blue-400">Throne of Grace Ministries&apos;</span> vision is restoring confident intimacy with God (worship), 
                equipping believers to live in grace (discipleship), and releasing grace into culture (outreach).
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <Container>
          <SectionHeader 
            title="Our Mission" 
            subtitle="What drives us forward in service to God and His people"
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
                &ldquo;To lead people into encounters with God&apos;s throne of{" "}
                <span className="bg-gradient-to-r from-tgm-gold to-tgm-lightgold bg-clip-text text-transparent font-bold">grace</span>{" "}
                through dynamic worship, biblical teaching, and radical acts of love, empowering them to walk in{" "}
                <span className="bg-gradient-to-r from-tgm-gold to-tgm-lightgold bg-clip-text text-transparent font-bold">freedom</span>,{" "}
                <span className="bg-gradient-to-r from-tgm-gold to-tgm-lightgold bg-clip-text text-transparent font-bold">authority</span>, and{" "}
                <span className="bg-gradient-to-r from-tgm-gold to-tgm-lightgold bg-clip-text text-transparent font-bold">purpose</span>.&rdquo;
              </blockquote>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Biblical Roots */}
      <section className="py-20 bg-tgm-background">
        <Container>
          <SectionHeader 
            title="Biblical Roots" 
            subtitle="The foundation of our calling and purpose"
            delay={0.1}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-tgm-gold to-tgm-lightgold rounded-full flex items-center justify-center">
                  <Globe className="h-6 w-6 text-tgm-blue" />
                </div>
                <h3 className="text-xl font-bold font-serif text-tgm-blue">Glory & Nations</h3>
              </div>
              <blockquote className="text-lg font-serif leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                &ldquo;Declare His glory among the nations, His marvelous deeds among all people.&rdquo;
              </blockquote>
              <cite className="text-sm font-medium text-tgm-gold italic">
                Psalm 96:3
              </cite>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-tgm-gold to-tgm-lightgold rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-tgm-blue" />
                </div>
                <h3 className="text-xl font-bold font-serif text-tgm-blue">Discipleship</h3>
              </div>
              <blockquote className="text-lg font-serif leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                &ldquo;Go and make disciples... teaching them to obey everything I have commanded you.&rdquo;
              </blockquote>
              <cite className="text-sm font-medium text-tgm-gold italic">
                Matthew 28:19–20
              </cite>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Focus Areas */}
      <section className="py-20">
        <Container>
          <SectionHeader 
            title="Focus Areas" 
            subtitle="The three pillars that guide our ministry"
            delay={0.1}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FocusCard
              title="Worship"
              verse="Create spaces where God's presence is tangible."
              reference="Psalm 22:3"
              icon={Music}
              delay={0.2}
            />
            <FocusCard
              title="Discipleship"
              verse="Teach grace-based identity and obedience."
              reference="Titus 2:11–12"
              icon={BookOpen}
              delay={0.3}
            />
            <FocusCard
              title="Outreach"
              verse="Demonstrate grace through service."
              reference="James 2:18"
              icon={HandHeart}
              delay={0.4}
            />
          </div>
        </Container>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-tgm-background">
        <Container>
          <SectionHeader 
            title="Core Values" 
            subtitle="The principles that shape our community and guide our decisions"
            delay={0.1}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ValueCard
              title="Confidence in Christ"
              description="We approach God not in our strength, but in Jesus' finished work."
              verse="In Him and through faith in Him we may approach God with freedom and confidence."
              reference="Ephesians 3:12"
              delay={0.2}
            />
            <ValueCard
              title="Grace-Driven Transformation"
              description="We preach grace that empowers holiness, not excuses sin."
              verse="For the grace of God has appeared that offers salvation to all people…"
              reference="Titus 2:11–12"
              delay={0.3}
            />
            <ValueCard
              title="Authentic Community"
              description="We reject performance-based faith; we grow together in vulnerability and truth."
              verse="Carry each other's burdens, and in this way you will fulfill the law of Christ."
              reference="Galatians 6:2"
              delay={0.4}
            />
            <ValueCard
              title="Kingdom Generosity"
              description="We give freely—whether resources, mercy, or time—because we've received freely."
              verse="Freely you have received; freely give."
              reference="Matthew 10:8"
              delay={0.5}
            />
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-tgm-hero text-white">
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Heart className="h-16 w-16 mx-auto mb-8 text-tgm-gold" />
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">
              Join Our Family
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Experience the love, unity, and grace that defines our community. 
              We welcome you to be part of our journey of faith and fellowship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/about"
                className="bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold px-8 py-4 rounded-lg font-medium transition-colors text-lg"
              >
                Learn More About Us
              </a>
              <a
                href="/contact"
                className="border-2 border-tgm-gold text-tgm-gold hover:bg-tgm-gold hover:text-tgm-blue px-8 py-4 rounded-lg font-medium transition-colors text-lg"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}
