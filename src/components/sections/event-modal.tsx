"use client"

import { Calendar, Clock, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { parseLocalDate } from "@/lib/dates"
import type { EventView } from "@/lib/db/services/event"

interface EventModalProps {
  event: EventView | null
  isOpen: boolean
  onClose: () => void
}

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Event Image */}
          <div className="aspect-video bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-white/90 text-blue-900">
                {event.category}
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-sm opacity-90">Event Image</p>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-medium">{formatDate(parseLocalDate(event.date))}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-medium">{event.time}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-medium">{event.location}</span>
            </div>
          </div>

          {/* Event Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About This Event</h3>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1">
              Join Event
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
