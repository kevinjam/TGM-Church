"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Headphones, Filter } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VideoCard } from "@/components/sections/video-card"
import { AudioCard } from "@/components/sections/audio-card"
import { categories, getVideoSermons, getAudioSermons } from "@/data/sermons"
import { Sermon } from "@/data/sermons"

export default function SermonsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [activeTab, setActiveTab] = useState<"all" | "video" | "audio">("all")
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Sermon | null>(null)

  const videoSermons = getVideoSermons().filter(sermon => 
    selectedCategory === "All" || sermon.category === selectedCategory
  )
  const audioSermons = getAudioSermons().filter(sermon => 
    selectedCategory === "All" || sermon.category === selectedCategory
  )

  const handlePlayAudio = (sermon: Sermon) => {
    setCurrentlyPlaying(sermon)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12 bg-tgm-background">
        <Container className="relative z-10">
          <div className="bg-gradient-tgm-hero rounded-xl p-6 md:p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 rounded-xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl" />
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto relative z-10"
            >
              <Play className="h-12 w-12 md:h-16 md:w-16 mx-auto text-tgm-gold mb-4" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Sermons
              </h1>
              <blockquote className="text-lg md:text-xl font-medium mb-2">
                &ldquo;Faith comes by hearing, and hearing by the Word of God.&rdquo;
              </blockquote>
              <cite className="text-sm md:text-base text-tgm-gold">Romans 10:17</cite>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Filter and Tabs Section */}
      <section className="py-4 bg-white border-b border-gray-200">
        <Container>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-gray-600" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 border-gray-300">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={activeTab === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("all")}
                className={activeTab === "all" ? "bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold" : "text-gray-600 hover:text-gray-800"}
              >
                All
              </Button>
              <Button
                variant={activeTab === "video" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("video")}
                className={activeTab === "video" ? "bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold" : "text-gray-600 hover:text-gray-800"}
              >
                <Play className="h-4 w-4 mr-1" />
                Video
              </Button>
              <Button
                variant={activeTab === "audio" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("audio")}
                className={activeTab === "audio" ? "bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold" : "text-gray-600 hover:text-gray-800"}
              >
                <Headphones className="h-4 w-4 mr-1" />
                Audio
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Video Sermons Section */}
      {(activeTab === "all" || activeTab === "video") && (
        <section className="py-8 md:py-12 bg-tgm-background">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
                Video Sermons
              </h2>
              <div className="flex justify-center mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-tgm-gold text-tgm-gold hover:bg-tgm-gold hover:text-tgm-blue"
                  asChild
                >
                  <a 
                    href="https://www.youtube.com/@josephkineneYGE" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    YouTube Channel
                  </a>
                </Button>
              </div>
            </motion.div>

            {videoSermons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {videoSermons.map((sermon, index) => (
                  <VideoCard
                    key={sermon.id}
                    sermon={sermon}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Play className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Video Sermons Found</h3>
                <p className="text-gray-500">Try selecting a different category or check back later for new content.</p>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* Audio Sermons Section */}
      {(activeTab === "all" || activeTab === "audio") && (
        <section className="py-8 md:py-12 bg-white">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
                Audio Sermons
              </h2>
            </motion.div>

            {audioSermons.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {audioSermons.map((sermon, index) => (
                  <AudioCard
                    key={sermon.id}
                    sermon={sermon}
                    delay={index * 0.1}
                    onPlay={handlePlayAudio}
                    isPlaying={currentlyPlaying?.id === sermon.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Headphones className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Audio Sermons Found</h3>
                <p className="text-gray-500">Try selecting a different category or check back later for new content.</p>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-8 md:py-12 bg-tgm-blue text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Join Us for Live Worship
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Experience the power of God&apos;s Word in person.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="sm"
                className="bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold transition-colors duration-300"
                asChild
              >
                <a href="/events">Service Times</a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-tgm-blue transition-colors duration-300"
                asChild
              >
                <a href="/contact">Get Directions</a>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}