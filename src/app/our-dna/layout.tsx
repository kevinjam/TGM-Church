import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Our DNA | Throne of Grace Ministries - TGM",
  description: "Discover the vision, mission, and core values of Throne of Grace Ministries. Rooted in grace, living for His glory. Connecting hearts to God's grace through worship, discipleship, and outreach.",
  keywords: ["TGM", "Throne of Grace Ministries", "church vision", "mission", "core values", "biblical foundation", "grace", "worship", "discipleship", "outreach"],
  openGraph: {
    title: "Our DNA | Throne of Grace Ministries",
    description: "Rooted in Grace. Living for His Glory. Discover our vision, mission, and biblical foundation.",
    type: "website",
  },
}

export default function OurDNALayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
