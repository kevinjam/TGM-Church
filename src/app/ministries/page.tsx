"use client"

import { motion } from "framer-motion"
import { Users, Mail, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ministries } from "@/data/ministries"
import { Container } from "@/components/layout/container"

export default function Ministries() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-tgm-background">
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
              Ministries
            </h1>
            <p className="text-xl md:text-2xl text-tgm-textmuted">
              Discover how you can serve and grow in our community
            </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Ministries Grid */}
      <section className="py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Ministries</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each ministry is designed to help you grow in your faith, serve others, 
              and connect with our community. Find your place and join us in making a difference.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry, index) => (
              <motion.div
                key={ministry.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm opacity-90">Ministry Image</p>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl">{ministry.name}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {ministry.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium">Leader:</span>
                        <span className="text-muted-foreground">{ministry.leader}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">Meeting Day:</span>
                        <span className="text-muted-foreground">{ministry.meetingDay}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">Time:</span>
                        <span className="text-muted-foreground">{ministry.meetingTime}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 space-y-2">
                      <Button className="w-full" asChild>
                        <a href={`mailto:${ministry.contact}`}>
                          <Mail className="mr-2 h-4 w-4" />
                          Contact Leader
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full">
                        Join Ministry
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted/30">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Involved?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              There&apos;s a place for everyone in our church family. Whether you&apos;re interested in 
              worship, youth ministry, children&apos;s programs, or community outreach, we&apos;d love 
              to help you find your calling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/contact">
                  Get In Touch
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/about">
                  Learn More About Us
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
