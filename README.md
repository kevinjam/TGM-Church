# TGM - The Gospel Mission Church Website

A modern, responsive church website built with Next.js, React, TypeScript, Tailwind CSS, and Shadcn UI for TGM (The Gospel Mission) located in Wakiso Nakawuka, Uganda.

## 🎯 Mission

**"Connecting Hearts to His Grace" (Hebrews 4:16)**

At Throne of Grace Ministries, we are honored to walk in the footsteps of biblical brothers who ministered together in unity and purpose—like Peter and Andrew, James and John, Moses and Aaron. Our mission is to extend God's mercy to the world and build a community rooted in prayer, unity, and discipleship (Psalm 133:1).

## 🚀 Features

### Core Pages
- **Home** - Hero section, welcome message, featured sermon, and upcoming events
- **Our DNA** - Mission, vision, and core values
- **About** - Church background story and Grace Team members
- **Sermons** - YouTube video library with live streaming capability
- **Events** - Upcoming and past events with detailed modals
- **Ministries** - Ministry cards with descriptions and contact info
- **Contact** - Contact form, church location, and social media links

### Technical Features
- ✅ **Fully Responsive Design** - Mobile, tablet, and desktop optimized
- ✅ **Dark/Light Mode Toggle** - Theme switching with system preference detection
- ✅ **YouTube Integration** - Video sermons and live streaming
- ✅ **Smooth Animations** - Framer Motion for page transitions and interactions
- ✅ **Modern UI Components** - Shadcn UI for consistent, accessible design
- ✅ **SEO Optimized** - Meta tags, Open Graph, and semantic HTML
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Modular Architecture** - Clean folder structure with reusable components

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme**: next-themes

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page with team section
│   ├── contact/           # Contact page with form
│   ├── events/            # Events page with modals
│   ├── ministries/        # Ministries page
│   ├── our-dna/          # Mission, vision, values
│   ├── sermons/          # Sermons with YouTube integration
│   └── page.tsx          # Home page
├── components/
│   ├── layout/           # Navbar, Footer
│   ├── sections/         # Page sections (Hero, Welcome, etc.)
│   ├── ui/              # Shadcn UI components
│   └── theme-provider.tsx
├── data/                 # Mock data for sermons, events, team, ministries
├── lib/                  # Utility functions
│   └── db/              # CMS data layer (MongoDB connection + models)
```

## 🎨 Design System

### Colors
- **Primary**: Deep blue (#3B82F6) - Represents trust and stability
- **Secondary**: Soft grays and whites - Clean, peaceful aesthetic
- **Accent**: Gold accents for special elements
- **Theme**: Graceful, spiritual, and hopeful tone

### Typography
- **Font**: Inter - Modern, readable, and elegant
- **Hierarchy**: Clear heading structure with proper contrast

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd church-tgm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:check` - Verify the MongoDB connection

## 🗄️ CMS Database (MongoDB)

The site includes a mini-CMS backend backed by MongoDB. All credentials stay
server-side — never expose them through `NEXT_PUBLIC_*` variables.

1. Copy the template and fill in your values:
   ```bash
   cp .env.example .env
   ```
2. Configure the connection (defaults target a local MongoDB):
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017
   MONGODB_DB=tgm_cms
   ```
3. Verify the connection works:
   ```bash
   npm run db:check
   ```

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

## 🌙 Dark Mode

The website includes a complete dark/light mode implementation:
- System preference detection
- Manual toggle in navigation
- Persistent theme selection
- Smooth transitions between themes

## 🎥 YouTube Integration

- **Sermon Library**: Browse past sermons by category
- **Live Streaming**: Dedicated section for live Sunday services
- **Video Player**: Embedded YouTube videos with custom styling
- **Categories**: Sunday Service, Bible Study, Youth, Worship

## 📧 Contact & Communication

- **Contact Form**: Name, email, and message fields
- **Prayer Requests**: Dedicated prayer request submission
- **Social Media**: Facebook, Instagram, YouTube links
- **Location**: Google Maps integration placeholder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TGM Church Community** - For the vision and mission
- **Shadcn UI** - For the beautiful component library
- **Next.js Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations

## 📞 Support

For support or questions about the website:
- Email: info@tgmchurch.org
- Phone: +256 XXX XXX XXX
- Location: Wakiso Nakawuka, Uganda

---

**Built with ❤️ for TGM - The Gospel Mission**