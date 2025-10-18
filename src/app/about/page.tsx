"use client"

import { motion } from "framer-motion"
import { Cross, Mail, MapPin, Calendar, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { teamMembers } from "@/data/team"
import { Container } from "@/components/layout/container"

export default function About() {
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
            <Cross className="h-16 w-16 mx-auto mb-6 text-tgm-gold" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About TGM
            </h1>
            <p className="text-xl md:text-2xl text-tgm-textmuted">
              Our Story, Our Mission, Our Family
            </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-tgm-blue">Our Story</h2>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-tgm-blue/70 leading-relaxed mb-8">
                Throne of Grace Ministries (TGM) was born out of a deep calling to serve the community 
                of Wakiso Nakawuka, Uganda. Our journey began with a simple yet profound vision: to 
                create a place where hearts could be connected to God&apos;s grace and where believers 
                could grow together in unity and purpose.
              </p>
              
              <p className="text-xl text-tgm-blue/70 leading-relaxed mb-8">
                Inspired by the biblical examples of brothers who ministered together—like Peter and 
                Andrew, James and John, Moses and Aaron—we established TGM as a community rooted in 
                prayer, unity, and discipleship. Our mission is to extend God&apos;s mercy to the world 
                and build a strong foundation of faith that transforms lives and communities.
              </p>
              
              <p className="text-xl text-tgm-blue/70 leading-relaxed mb-8">
                Today, TGM stands as a beacon of hope in Wakiso Nakawuka, welcoming people from all 
                walks of life to experience the love of Christ. We are committed to creating an 
                environment where everyone can grow in their relationship with God and find their 
                place in His family.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Church Info Section */}
      <section className="py-20 bg-muted/30">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Church Information</h2>
            <p className="text-xl text-muted-foreground">
              Learn more about our church and how to connect with us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center">
                <CardContent className="p-8">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Location</h3>
                  <p className="text-muted-foreground">
                    Wakiso Nakawuka, Uganda
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="text-center">
                <CardContent className="p-8">
                  <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Service Times</h3>
                  <p className="text-muted-foreground">
                    Sundays at 10:00 AM
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="text-center">
                <CardContent className="p-8">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Community</h3>
                  <p className="text-muted-foreground">
                    Growing family of believers
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Grace Team Section */}
      <section className="py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Grace Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the dedicated leaders who serve our community with love, wisdom, and commitment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.title}</p>
                    <p className="text-sm text-muted-foreground mb-4">{member.role}</p>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {member.bio}
                    </p>
                    
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${member.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Contact
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-tgm-blue text-tgm-text">
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Family
            </h2>
            <p className="text-xl mb-8 opacity-90">
              We welcome you to be part of our community. Whether you&apos;re new to faith or have been 
              walking with Christ for years, there&apos;s a place for you at TGM.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Visit Us
              </a>
              <a
                href="/ministries"
                className="border-2 border-tgm-gold text-tgm-gold hover:bg-tgm-gold hover:text-tgm-blue px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Get Involved
              </a>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}
