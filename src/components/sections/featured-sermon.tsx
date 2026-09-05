"use client"

import { motion } from "framer-motion"
import { Play, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Container } from "@/components/layout/container"
import type { HomeFeaturedSermonSection } from "@/lib/db/services/homepage"

export function FeaturedSermon({ content }: { content: HomeFeaturedSermonSection }) {
  const { sermon } = content

  return (
    <section className="pt-2 pb-12 md:pt-4 md:pb-16 bg-tgm-background">
        <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-4 sm:mb-6 md:mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
            {content.heading}
          </h2>
          <p className="text-lg text-gray-600">
            {content.tagline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="overflow-hidden">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-900 to-blue-700 relative">
                {sermon.thumbnail ? (
                  <Image
                    src={sermon.thumbnail}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 896px"
                    className="object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                    asChild
                  >
                    <Link href={`/sermons#${sermon.id}`}>
                      <Play className="mr-2 h-5 w-5" />
                      Watch Now
                    </Link>
                  </Button>
                </div>
                {sermon.duration ? (
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                    {sermon.duration}
                  </div>
                ) : null}
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">
                    {sermon.title}
                  </h3>
                  <p className="text-gray-600">
                    {sermon.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{sermon.speaker}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{sermon.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {sermon.category}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={content.cta.href}>
                      {content.cta.label}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </Container>
    </section>
  )
}
