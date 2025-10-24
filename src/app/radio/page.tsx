"use client"

import { motion } from "framer-motion"
import { Radio, Clock, MapPin, Bell, Play, Users, Heart, BookOpen, Music, Mic, Calendar } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function RadioPage() {
  const programmingSchedule = [
    { day: "Monday - Friday", time: "6:00 AM - 8:00 AM", program: "Morning Glory", description: "Start your day with worship, prayer, and God's Word" },
    { day: "Saturday", time: "7:00 AM - 9:00 AM", program: "Weekend Revival", description: "Special weekend programming with testimonies and community features" },
    { day: "Sunday", time: "8:00 AM - 10:00 AM", program: "Sunday Celebration", description: "Live worship and sermon broadcast from TGM services" }
  ]

  const programFeatures = [
    { icon: BookOpen, title: "Daily Devotionals", description: "Inspiring morning devotionals to start your day with God's Word" },
    { icon: Music, title: "Worship Music", description: "Uplifting Christian music and hymns throughout the day" },
    { icon: Heart, title: "Prayer Requests", description: "Community prayer support and intercession ministry" },
    { icon: Users, title: "Testimonies", description: "Powerful testimonies from our TGM family and community" },
    { icon: Mic, title: "Live Preaching", description: "Dynamic preaching and teaching from TGM pastors" },
    { icon: Calendar, title: "Community Events", description: "Updates on church events, programs, and community outreach" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 bg-tgm-background">
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
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                className="mb-4 sm:mb-6 md:mb-8"
              >
                <Radio className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 mx-auto text-tgm-gold" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 sm:mb-3 md:mb-4"
              >
                TGM Radio Live
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mb-6 sm:mb-7 md:mb-8"
              >
                <Badge className="bg-tgm-gold text-tgm-blue px-4 py-2 text-lg font-semibold mb-4">
                  Coming Soon
                </Badge>
                <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-2">
                  &ldquo;So faith comes from hearing, and hearing through the word of Christ.&rdquo;
                </blockquote>
                <cite className="text-sm sm:text-base md:text-lg text-tgm-gold">Romans 10:17</cite>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* About Radio Ministry */}
      <section className="py-12 md:py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              About TGM Radio Ministry
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              TGM Radio Live is our upcoming radio ministry designed to reach hearts across Uganda and beyond. 
              Through the power of radio waves, we aim to spread the Gospel, provide spiritual encouragement, 
              and build a stronger community of believers connected through faith.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-tgm-blue">
                    <MapPin className="h-6 w-6 text-tgm-gold" />
                    Coverage Area
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Primary Coverage</h4>
                    <p className="text-gray-600">Wakiso District and surrounding areas within a 50km radius</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Extended Reach</h4>
                    <p className="text-gray-600">Central Uganda region including Kampala, Entebbe, and Mukono</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Online Streaming</h4>
                    <p className="text-gray-600">Worldwide access through our website and mobile app</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-tgm-blue">
                    <Heart className="h-6 w-6 text-tgm-gold" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    To reach the unreached and strengthen the faith of believers through accessible, 
                    inspiring radio programming that brings God&apos;s Word to every home and heart.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-tgm-gold rounded-full"></div>
                      <span className="text-sm text-gray-600">Spread the Gospel through radio waves</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-tgm-gold rounded-full"></div>
                      <span className="text-sm text-gray-600">Provide spiritual encouragement daily</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-tgm-gold rounded-full"></div>
                      <span className="text-sm text-gray-600">Build community through shared faith</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Programming Schedule */}
      <section className="py-12 md:py-16 bg-tgm-background">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Programming Schedule
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join us for daily programming designed to inspire, encourage, and strengthen your faith journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programmingSchedule.map((schedule, index) => (
              <motion.div
                key={schedule.day}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl text-tgm-blue">{schedule.program}</CardTitle>
                    <div className="flex items-center justify-center gap-2 text-tgm-gold">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold">{schedule.day}</span>
                    </div>
                    <Badge className="bg-tgm-gold/10 text-tgm-blue border-tgm-gold/20 w-fit mx-auto">
                      {schedule.time}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{schedule.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Program Features */}
      <section className="py-12 md:py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              What You&apos;ll Hear
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our programming is designed to provide spiritual nourishment, community connection, and practical guidance for daily Christian living.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-tgm-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-tgm-gold" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-tgm-blue via-tgm-blue to-tgm-gold text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-tgm-gold/10 rounded-full blur-xl" />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stay Connected with TGM Radio
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Be the first to know when we go live on the airwaves. Join our notification list for updates on launch dates, frequency information, and special programming announcements.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
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
                <Play className="h-5 w-5 mr-2" />
                Learn More About Radio Ministry
              </Button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Radio Ministry Coordinator:</strong><br />
                  Pastor Kinene<br />
                  Email: info@mytgmchurch.com<br />
                  Phone: +256 703 390633
                </div>
                <div>
                  <strong>Technical Support:</strong><br />
                  TGM Media Team<br />
                  Email: media@tgmchurch.org<br />
                  Phone: +256 703 390633
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}
