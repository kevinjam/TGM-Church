"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, Youtube } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Container } from "@/components/layout/container"
import type { ContactPageContent } from "@/lib/db/services/contact-page"

function SocialButton({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  const className = "h-12 w-12"
  if (href) {
    return (
      <Button variant="outline" size="icon" className={className} asChild>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
          <span className="sr-only">{label}</span>
        </a>
      </Button>
    )
  }
  return (
    <Button variant="outline" size="icon" className={className}>
      {children}
      <span className="sr-only">{label}</span>
    </Button>
  )
}

export function ContactView({ content }: { content: ContactPageContent }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = (await response.json().catch(() => ({}))) as { error?: string }

      if (!response.ok) {
        setError(data.error ?? "Unable to send your message. Please try again.")
        return
      }

      setSuccess(true)
      setFormData({ name: "", email: "", message: "", company: "" })
    } catch {
      setError("Unable to send your message. Please check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-200">
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
            <Mail className="h-16 w-16 mx-auto mb-6 text-tgm-gold" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              {content.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-tgm-textmuted">
              {content.hero.subtitle}
            </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-gray-200">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800">{content.form.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="relative space-y-6">
                    <div className="hidden" aria-hidden="true">
                      <input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-800">{content.form.nameLabel}</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={content.form.namePlaceholder}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-800">{content.form.emailLabel}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={content.form.emailPlaceholder}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-800">{content.form.messageLabel}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={content.form.messagePlaceholder}
                        rows={6}
                        required
                      />
                    </div>
                    
                    {error && (
                      <p role="alert" className="text-sm text-red-700">
                        {error}
                      </p>
                    )}
                    {success && (
                      <p className="text-sm text-green-700">
                        {content.form.successMessage}
                      </p>
                    )}
                    <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                      <Send className="mr-2 h-4 w-4" />
                      {submitting ? content.form.sendingLabel : content.form.submitLabel}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800">{content.details.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-gray-600 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-800">{content.details.addressLabel}</h3>
                      <p className="text-gray-800">
                        {content.details.address}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-gray-600 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-800">{content.details.phoneLabel}</h3>
                      <p className="text-gray-800">
                       {content.details.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-gray-600 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-800">{content.details.emailLabel}</h3>
                      <p className="text-gray-800">
                        {content.details.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-gray-600 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-800">{content.details.serviceTimesLabel}</h3>
                      <p className="text-gray-800">
                        {content.details.serviceTimes}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800">{content.social.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <SocialButton href={content.social.facebook} label="Facebook">
                      <Facebook className="h-5 w-5" />
                    </SocialButton>
                    <SocialButton href={content.social.instagram} label="Instagram">
                      <Instagram className="h-5 w-5" />
                    </SocialButton>
                    <SocialButton href={content.social.youtube} label="YouTube">
                      <Youtube className="h-5 w-5" />
                    </SocialButton>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800">{content.map.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-blue-800">
                      <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                      <p className="font-medium text-gray-800">{content.map.heading}</p>
                      <p className="text-sm text-gray-600">{content.map.subtitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Prayer Request Section */}
      <section className="py-20 bg-muted/30">
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              {content.prayer.heading}
            </h2>
            <p className="text-xl text-gray-800 mb-8">
              {content.prayer.body}
            </p>
            <Button size="lg" asChild>
              <a href={content.prayer.cta.href}>
                <Mail className="mr-2 h-4 w-4" />
                {content.prayer.cta.label}
              </a>
            </Button>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}
