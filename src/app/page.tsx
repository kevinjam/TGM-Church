import { HeroSlider } from "@/components/sections/hero-slider"
import { Welcome } from "@/components/sections/welcome"
import { FeaturedSermon } from "@/components/sections/featured-sermon"
import { UpcomingEvents } from "@/components/sections/upcoming-events"

export default function Home() {
  return (
    <div className="bg-gray-200">
      <HeroSlider />
      <Welcome />
      <FeaturedSermon />
      <UpcomingEvents />
    </div>
  )
}