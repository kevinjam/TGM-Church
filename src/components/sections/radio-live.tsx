"use client"

import { motion } from "framer-motion"
import { Radio, Clock, MapPin, Bell, Play } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RadioLive() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-tgm-blue via-tgm-blue to-tgm-gold text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-tgm-gold/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/3 rounded-full blur-lg" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="mb-6"
          >
            <Radio className="h-16 w-16 mx-auto text-tgm-gold" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            TGM Radio Live
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-8"
          >
            <Badge className="bg-tgm-gold text-tgm-blue px-4 py-2 text-lg font-semibold mb-4">
              Coming Soon
            </Badge>
            <p className="text-xl md:text-2xl text-tgm-textmuted max-w-3xl mx-auto">
              Tune in to our upcoming radio ministry and experience God&apos;s Word through the airwaves
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {/* Radio Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white h-full">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-tgm-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-tgm-gold" />
                </div>
                <h3 className="text-xl font-bold mb-3">Broadcast Schedule</h3>
                <p className="text-tgm-textmuted mb-4">
                  Daily programming with inspiring messages, worship, and community updates
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="text-tgm-gold">6:00 AM - 8:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="text-tgm-gold">7:00 AM - 9:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="text-tgm-gold">8:00 AM - 10:00 AM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Coverage Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white h-full">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-tgm-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-tgm-gold" />
                </div>
                <h3 className="text-xl font-bold mb-3">Coverage Area</h3>
                <p className="text-tgm-textmuted mb-4">
                  Reaching hearts across Uganda and beyond through radio waves
                </p>
                <div className="space-y-2 text-sm">
                  <div className="text-tgm-gold font-semibold">Primary Coverage:</div>
                  <div>Wakiso District & Surrounding Areas</div>
                  <div className="text-tgm-gold font-semibold mt-3">Extended Reach:</div>
                  <div>Central Uganda Region</div>
                  <div className="text-tgm-gold font-semibold mt-3">Online Streaming:</div>
                  <div>Worldwide Access</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Programming */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white h-full">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-tgm-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-tgm-gold" />
                </div>
                <h3 className="text-xl font-bold mb-3">Programming</h3>
                <p className="text-tgm-textmuted mb-4">
                  Inspiring content designed to uplift and encourage listeners
                </p>
                <div className="space-y-2 text-sm">
                  <div className="text-tgm-gold font-semibold">Daily Features:</div>
                  <div>• Morning Devotionals</div>
                  <div>• Scripture Reading</div>
                  <div>• Worship Music</div>
                  <div>• Community News</div>
                  <div>• Prayer Requests</div>
                  <div>• Testimonies</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Tuned for TGM Radio Live
            </h3>
            <p className="text-lg text-tgm-textmuted mb-6">
              Be the first to know when we go live on the airwaves. Join our notification list for updates on launch dates, frequency information, and special programming announcements.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold transition-colors duration-300"
              >
                <Bell className="h-5 w-5 mr-2" />
                Notify Me When Live
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-tgm-blue transition-colors duration-300"
              >
                Learn More About Radio Ministry
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm text-tgm-textmuted">
                &ldquo;So faith comes from hearing, and hearing through the word of Christ.&rdquo; — Romans 10:17
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
