"use client"

import { motion } from "framer-motion"
import { Cross, Mail, MapPin, Calendar, Users, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import type { AboutContent, AboutInfoIcon } from "@/lib/db/services/about"

const INFO_ICONS: Record<AboutInfoIcon, LucideIcon> = {
  location: MapPin,
  calendar: Calendar,
  community: Users,
}

export function AboutView({ content }: { content: AboutContent }) {
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
              {content.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-tgm-textmuted">
              {content.hero.subtitle}
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
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-tgm-blue">{content.story.heading}</h2>
            
            <div className="prose prose-lg max-w-none">
              {content.story.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-xl text-tgm-blue/70 leading-relaxed mb-8">
                  {paragraph}
                </p>
              ))}
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{content.info.heading}</h2>
            <p className="text-xl text-muted-foreground">
              {content.info.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.info.cards.map((card, index) => {
              const Icon = INFO_ICONS[card.icon]
              return (
                <motion.div
                  key={`${card.title}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center">
                    <CardContent className="p-8">
                      <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                      <p className="text-muted-foreground">
                        {card.body}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{content.team.heading}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {content.team.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.team.members.map((member, index) => (
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
              {content.cta.heading}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {content.cta.body}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={content.cta.primaryCta.href}
                className="bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold px-8 py-3 rounded-lg font-medium transition-colors"
              >
                {content.cta.primaryCta.label}
              </a>
              <a
                href={content.cta.secondaryCta.href}
                className="border-2 border-tgm-gold text-tgm-gold hover:bg-tgm-gold hover:text-tgm-blue px-8 py-3 rounded-lg font-medium transition-colors"
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
