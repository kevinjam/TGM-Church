import Link from "next/link"
import { Cross, MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import type { SiteSettingsView } from "@/lib/db/services/site-settings"

export function Footer({ settings }: { settings: SiteSettingsView }) {
  const { brand, contact, socials, footer } = settings

  const socialLinks: Array<{ label: string; icon: typeof Facebook; url: string }> = [
    { label: "Facebook", icon: Facebook, url: socials.facebook },
    { label: "Instagram", icon: Instagram, url: socials.instagram },
    { label: "YouTube", icon: Youtube, url: socials.youtube },
  ]

  return (
    <footer className="bg-tgm-blue border-t border-tgm-gold/20">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Cross className="h-6 w-6 text-tgm-gold" />
              <div>
                <h3 className="font-bold text-lg text-tgm-text">{brand.shortName}</h3>
                <p className="text-sm text-tgm-textmuted">{brand.displayName}</p>
              </div>
            </div>
            <p className="text-sm text-tgm-textmuted">
              {footer.description}
            </p>
            <p className="text-sm text-tgm-textmuted">
              Located in {contact.address}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-tgm-text">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/our-dna" className="text-tgm-textmuted hover:text-tgm-gold transition-colors">
                  Our DNA
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-tgm-textmuted hover:text-tgm-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/sermons" className="text-tgm-textmuted hover:text-tgm-gold transition-colors">
                  Sermons
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-tgm-textmuted hover:text-tgm-gold transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/ministries" className="text-tgm-textmuted hover:text-tgm-gold transition-colors">
                  Ministries
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-tgm-text">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-tgm-gold" />
                <span className="text-tgm-textmuted">
                  {contact.address}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-tgm-gold" />
                <span className="text-tgm-textmuted">
                  {contact.phone}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-tgm-gold" />
                <span className="text-tgm-textmuted">
                  {contact.email}
                </span>
              </div>
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-tgm-text">Connect With Us</h4>
            <div className="flex space-x-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                const iconButtonClass =
                  "h-9 w-9 border-tgm-gold/30 text-tgm-gold hover:bg-tgm-gold hover:text-tgm-blue"
                const content = (
                  <>
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{social.label}</span>
                  </>
                )
                return social.url ? (
                  <Button
                    key={social.label}
                    variant="outline"
                    size="icon"
                    className={iconButtonClass}
                    asChild
                  >
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      {content}
                    </a>
                  </Button>
                ) : (
                  <Button
                    key={social.label}
                    variant="outline"
                    size="icon"
                    className={iconButtonClass}
                  >
                    {content}
                  </Button>
                )
              })}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-tgm-textmuted">
                Join our newsletter for updates
              </p>
              <Button size="sm" className="w-full bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-tgm-gold/20 mt-8 pt-8 text-center text-sm text-tgm-textmuted">
          <p>{footer.copyright}</p>
          <p className="mt-1">Built with love for our community in Nakawuka, Wakiso District, Uganda</p>
        </div>
      </Container>
    </footer>
  )
}
