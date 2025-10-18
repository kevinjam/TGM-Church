"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ScriptureCardProps {
  verse: string
  reference: string
  className?: string
  delay?: number
  variant?: "default" | "highlighted"
}

export function ScriptureCard({ 
  verse, 
  reference, 
  className, 
  delay = 0,
  variant = "default" 
}: ScriptureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={cn("w-full", className)}
    >
      <Card className={cn(
        "h-full border-0 shadow-lg",
        variant === "highlighted" 
          ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900" 
          : "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
      )}>
        <CardContent className="p-8 text-center">
          <blockquote className="text-lg md:text-xl font-serif leading-relaxed text-gray-800 dark:text-gray-200 mb-6">
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
