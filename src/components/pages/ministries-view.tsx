"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Users, Heart, BookOpen, Users2, Baby, GraduationCap, type LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import type { MinistryIconKey } from "@/lib/db/constants"
import type { MinistryView } from "@/lib/db/services/ministry"

const DEFAULT_MINISTRY_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"

const ICON_BY_KEY: Record<MinistryIconKey, LucideIcon> = {
  youth: Users,
  men: Users2,
  women: Heart,
  marrieds: Heart,
  children: Baby,
  schools: GraduationCap,
  default: BookOpen,
}

function ministryIcon(ministry: MinistryView): LucideIcon {
  if (ministry.icon && ICON_BY_KEY[ministry.icon]) {
    return ICON_BY_KEY[ministry.icon]
  }
  const name = ministry.name
  if (name.includes("Youth")) return Users
  if (name.includes("Men")) return Users2
  if (name.includes("Women")) return Heart
  if (name.includes("Marrieds")) return Heart
  if (name.includes("Children")) return Baby
  if (name.includes("Schools")) return GraduationCap
  return BookOpen
}

export function MinistriesView({ ministries }: { ministries: MinistryView[] }) {
  return (
    <div className="min-h-screen bg-gray-200">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-tgm-background to-tgm-lightgold/10">
        <Container className="relative z-10">
          <div className="bg-gradient-tgm-hero rounded-2xl p-12 md:p-16 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 rounded-2xl" />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto relative z-10"
            >
            <Users className="h-16 w-16 mx-auto mb-6 text-tgm-gold" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our Ministries
            </h1>
            <p className="text-xl md:text-2xl text-tgm-textmuted">
              Discover the grace in every generation.
            </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Ministries Grid */}
      <section className="py-20 bg-gray-200">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ministries.map((ministry, index) => {
              const Icon = ministryIcon(ministry)
              
              return (
                <motion.div
                  key={ministry.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={ministry.image || DEFAULT_MINISTRY_IMAGE}
                        alt="Open Bible - Ministry"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-tgm-gold" />
                          <span className="text-sm font-medium">Ministry</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-serif text-tgm-blue">{ministry.name}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-700 text-base leading-relaxed">
                        {ministry.description}
                      </p>
                      
                      {ministry.cta && (
                        <div className="pt-4">
                          <Button className="w-full bg-tgm-gold hover:bg-tgm-lightgold text-tgm-blue font-semibold shadow-md">
                            {ministry.cta}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-tgm-background to-tgm-lightgold/10">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <Heart className="h-16 w-16 mx-auto mb-8 text-tgm-gold" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-tgm-blue">
              Find Your Place in Grace
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-600 mb-8 leading-relaxed">
              Every generation has a unique role in God&apos;s kingdom. Whether you&apos;re a young person 
              discovering your purpose, a parent raising children in faith, or someone seeking to serve 
              in education, there&apos;s a ministry waiting for you. Join us as we approach God&apos;s 
              throne of grace together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-tgm-gold hover:bg-tgm-lightgold text-tgm-blue font-medium" asChild>
                <a href="/contact">
                  Get In Touch
                </a>
              </Button>
              <Button variant="outline" size="lg" className="border-tgm-gold text-tgm-gold hover:bg-tgm-gold hover:text-tgm-blue" asChild>
                <a href="/our-dna">
                  Learn More About Us
                </a>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}
