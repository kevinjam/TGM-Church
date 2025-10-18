"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ValueCardProps {
  title: string
  description: string
  verse: string
  reference: string
  className?: string
  delay?: number
}

export function ValueCard({ 
  title, 
  description, 
  verse, 
  reference, 
  className, 
  delay = 0 
}: ValueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={cn("w-full", className)}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold font-serif text-gray-800 dark:text-gray-200">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {description}
          </p>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <blockquote className="text-sm font-serif leading-relaxed text-gray-600 dark:text-gray-400 mb-2">
              &ldquo;{verse}&rdquo;
            </blockquote>
            <cite className="text-xs font-medium text-blue-600 dark:text-blue-400 italic">
              {reference}
            </cite>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
