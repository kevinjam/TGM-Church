"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FocusCardProps {
  title: string
  verse: string
  reference: string
  icon: LucideIcon
  className?: string
  delay?: number
}

export function FocusCard({ 
  title, 
  verse, 
  reference, 
  icon: Icon, 
  className, 
  delay = 0 
}: FocusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={cn("w-full", className)}
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon className="h-8 w-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold font-serif mb-4 text-gray-800 dark:text-gray-200">
            {title}
          </h3>
          
          <blockquote className="text-base font-serif leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            &ldquo;{verse}&rdquo;
          </blockquote>
          
          <cite className="text-sm font-medium text-blue-600 dark:text-blue-400 italic">
            {reference}
          </cite>
        </CardContent>
      </Card>
    </motion.div>
  )
}
