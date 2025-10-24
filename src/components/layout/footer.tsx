import Link from "next/link"
import { Cross, MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"

export function Footer() {
  return (
    <footer className="bg-tgm-blue border-t border-tgm-gold/20">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Cross className="h-6 w-6 text-tgm-gold" />
              <div>
                <h3 className="font-bold text-lg text-tgm-text">TGM</h3>
                <p className="text-sm text-tgm-textmuted">The Gospel Mission</p>
              </div>
            </div>
            <p className="text-sm text-tgm-textmuted">
              Connecting Hearts to His Grace (Hebrews 4:16)
            </p>
            <p className="text-sm text-tgm-textmuted">
              Located in Nakawuka, Wakiso District, Uganda
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
                  Nakawuka, Wakiso District, Uganda
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-tgm-gold" />
                <span className="text-tgm-textmuted">
                  +256 703 390633
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-tgm-gold" />
                <span className="text-tgm-textmuted">
                  jkinene@gmail.com
                </span>
              </div>
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-tgm-text">Connect With Us</h4>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="h-9 w-9 border-tgm-gold/30 text-tgm-gold hover:bg-tgm-gold hover:text-tgm-blue">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 border-tgm-gold/30 text-tgm-gold hover:bg-tgm-gold hover:text-tgm-blue">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 border-tgm-gold/30 text-tgm-gold hover:bg-tgm-gold hover:text-tgm-blue">
                <Youtube className="h-4 w-4" />
                <span className="sr-only">YouTube</span>
              </Button>
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
          <p>&copy; 2024 TGM - The Gospel Mission. All rights reserved.</p>
          <p className="mt-1">Built with love for our community in Nakawuka, Wakiso District, Uganda</p>
        </div>
      </Container>
    </footer>
  )
}
