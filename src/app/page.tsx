import { Hero } from "@/components/sections/hero"
import { Welcome } from "@/components/sections/welcome"
import { FeaturedSermon } from "@/components/sections/featured-sermon"
import { UpcomingEvents } from "@/components/sections/upcoming-events"

export default function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <FeaturedSermon />
      <UpcomingEvents />
    </>
  )
}