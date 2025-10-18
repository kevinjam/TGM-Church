"use client"

import { motion } from "framer-motion"
import { Play, Radio } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"

export function LiveStream() {
  return (
    <section className="py-20 bg-gradient-to-br from-red-600 to-red-800 text-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Radio className="h-8 w-8 text-white" />
            <h2 className="text-4xl md:text-5xl font-bold">Live Stream</h2>
          </div>
          <p className="text-xl text-red-100">
            Join us for our live Sunday service
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="overflow-hidden bg-white/10 backdrop-blur-sm border-white/20">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative">
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Live Service</h3>
                  <p className="text-gray-300 mb-4">Sundays at 10:00 AM (EAT)</p>
                  <Button 
                    size="lg" 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    asChild
                  >
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Play className="mr-2 h-4 w-4" />
                      Watch Live
                    </a>
                  </Button>
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="text-center">
                <h4 className="text-xl font-semibold mb-2">Sunday Service</h4>
                <p className="text-gray-300 mb-4">
                  Join us for worship, prayer, and the Word of God
                </p>
                <div className="flex flex-wrap gap-2 justify-center text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full">Worship</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">Prayer</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">Word</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">Fellowship</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </section>
  )
}
