import { HeroSlider } from "@/components/sections/hero-slider"
import { Welcome } from "@/components/sections/welcome"
import { FeaturedSermon } from "@/components/sections/featured-sermon"
import { UpcomingEvents } from "@/components/sections/upcoming-events"
import { getHomepageContent } from "@/lib/db/services/homepage"

// The homepage reads its sections from MongoDB (with the original
// hardcoded copy as defaults), so CMS edits show immediately.
export const dynamic = "force-dynamic"

export default async function Home() {
  const content = await getHomepageContent()

  return (
    <div className="bg-gray-200">
      <HeroSlider hero={content.hero} />
      <Welcome content={content.welcome} />
      <FeaturedSermon content={content.featuredSermon} />
      <UpcomingEvents content={content.upcomingEvents} />
    </div>
  )
}
