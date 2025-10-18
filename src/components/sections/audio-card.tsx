"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, ExternalLink, Calendar, User, Clock, Headphones } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sermon } from "@/data/sermons"

interface AudioCardProps {
  sermon: Sermon
  delay?: number
  onPlay?: (sermon: Sermon) => void
  isPlaying?: boolean
}

export function AudioCard({ sermon, delay = 0, onPlay, isPlaying = false }: AudioCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePlay = () => {
    onPlay?.(sermon)
    setIsModalOpen(true)
  }

  const handleExternalLink = () => {
    if (sermon.castboxUrl) {
      window.open(sermon.castboxUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <Card className={`group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 ${isPlaying ? 'ring-2 ring-tgm-gold' : ''}`}>
        {/* Audio Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-tgm-blue to-tgm-gold overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Headphones className="h-12 w-12 mx-auto mb-2 opacity-80" />
              <p className="text-sm opacity-80">Audio Sermon</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-tgm-blue transition-colors duration-300 line-clamp-2">
                    {sermon.title}
                  </h3>
                  <Badge variant="secondary" className="ml-2 bg-tgm-gold/10 text-tgm-blue border-tgm-gold/20">
                    {sermon.category}
                  </Badge>
                </div>
                {sermon.scripture && (
                  <p className="text-sm text-tgm-gold font-medium italic">
                    {sermon.scripture}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-2">
              {sermon.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{sermon.speaker}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{sermon.date}</span>
              </div>
              {sermon.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{sermon.duration}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {sermon.castboxEmbedUrl ? (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="flex-1 bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold transition-colors duration-300"
                      onClick={handlePlay}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Listen Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-full">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-gray-800">
                        {sermon.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video">
                      <iframe
                        src={sermon.castboxEmbedUrl}
                        title={sermon.title}
                        className="w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-gray-600">{sermon.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Speaker: {sermon.speaker}</span>
                        <span>Date: {sermon.date}</span>
                        {sermon.duration && <span>Duration: {sermon.duration}</span>}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button disabled className="flex-1 bg-gray-300 text-gray-500 cursor-not-allowed">
                  <Play className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              )}
              
              {sermon.castboxUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  className="border-tgm-gold text-tgm-gold hover:bg-tgm-gold hover:text-tgm-blue transition-colors duration-300"
                  onClick={handleExternalLink}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
