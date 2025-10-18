"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Menu, Sun, Moon, Cross } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Container } from "@/components/layout/container"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Our DNA", href: "/our-dna" },
  { name: "About", href: "/about" },
  { name: "Sermons", href: "/sermons" },
  { name: "Events", href: "/events" },
  { name: "Ministries", href: "/ministries" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b-2 border-tgm-gold/30 bg-tgm-blue shadow-lg backdrop-blur-sm"
    >
      <Container className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="p-2 bg-tgm-gold/10 rounded-lg group-hover:bg-tgm-gold/20 transition-colors">
            <Cross className="h-8 w-8 text-tgm-gold" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-tgm-text group-hover:text-tgm-gold transition-colors">TGM</span>
            <span className="text-xs text-tgm-textmuted group-hover:text-tgm-gold/80 transition-colors">The Gospel Mission</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-tgm-text rounded-lg transition-all duration-200 hover:text-tgm-gold hover:bg-tgm-gold/10 hover:shadow-sm"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Theme Toggle & Mobile Menu */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-10 w-10 text-tgm-text hover:text-tgm-gold hover:bg-tgm-gold/15 rounded-lg transition-all duration-200"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 text-tgm-text hover:text-tgm-gold hover:bg-tgm-gold/15 rounded-lg transition-all duration-200">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-tgm-blue border-tgm-gold/30 shadow-xl">
              <div className="flex items-center space-x-3 mb-8 pt-4">
                <div className="p-2 bg-tgm-gold/10 rounded-lg">
                  <Cross className="h-6 w-6 text-tgm-gold" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-tgm-text">TGM</span>
                  <span className="text-xs text-tgm-textmuted">The Gospel Mission</span>
                </div>
              </div>
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 text-lg font-medium text-tgm-text rounded-lg transition-all duration-200 hover:text-tgm-gold hover:bg-tgm-gold/10"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </motion.header>
  )
}
