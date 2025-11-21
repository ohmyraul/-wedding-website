# Shubs & Alysha Wedding Website

A beautiful, hand-drawn style wedding website built with React, Vite, and Tailwind CSS. Features a Mario Miranda-inspired sketchy aesthetic with smooth scroll animations, interactive elements, and a fully responsive design.

## Features

- ✨ Hand-drawn, sketchy design aesthetic (Mario Miranda style)
- 📱 Fully responsive design (mobile-first)
- 🎨 Custom watercolor backgrounds and scroll-triggered animations
- 👨‍👩‍👧‍👦 Family mode with exclusive sections (Kidena House, Family Itinerary)
- 📝 RSVP form (Formspree integration)
- 🗺️ Travel information and detailed Goa recommendations
- ❓ FAQ section
- 🎉 Celebration timeline with full event details
- 🎵 Background music player
- 🐕 Cookie & Bailey interactive section
- 📍 Scroll-snap navigation with dot indicators
- ♿ Accessibility optimized (ARIA labels, keyboard navigation)
- 🚀 SEO optimized (meta tags, Open Graph, structured data)
- ⚡ Performance optimized (lazy loading, React.memo)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
wedding-website/
├── src/
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Customization

All the content is in `src/App.jsx`. You can customize:
- Names and dates
- Images (currently using Unsplash placeholders)
- Colors in the CSS variables
- Content in each section
- Family mode features

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

**Current Deployment**: https://wedding-website-6ov3dt7w1-shubs-projects-0798d61b.vercel.app

### Other Options

- **Netlify**: Drag and drop the `dist` folder after building
- **GitHub Pages**: Use GitHub Actions to build and deploy

## Form Setup

The RSVP form uses Formspree. To set up:

1. Create an account at [Formspree.io](https://formspree.io)
2. Create a new form and get your endpoint URL
3. Update `FORMSPREE_ENDPOINT` in `src/App.jsx` (line ~1951)

## Image Requirements

Place images in `/public/images/`:
- `hero.jpg` - Main hero image (eager load)
- `firsttime.jpg` - Story section
- `office.jpg` - Story section
- `goa-scooter.jpg` - Story section
- `proposal.jpg` - Story section
- `cookie.jpg` - Cookie & Bailey section
- `bailey.jpg` - Cookie & Bailey section
- `kidena-house.jpg` - Family section
- `blu-missel.jpeg` - Celebration section

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Intersection Observer** - Scroll-triggered animations
- **Canvas Confetti** - Confetti animations
- **Lucide React** - Icon library
- **Google Fonts** - Crimson Pro, Inter, Kalam
- **Formspree** - Form submission handling

## Performance Optimizations

- ✅ Lazy loading for images (except hero)
- ✅ React.memo for component optimization
- ✅ Scroll-snap for smooth navigation
- ✅ Optimized bundle size (~350KB gzipped)
- ✅ Production-ready error handling

## SEO & Accessibility

- ✅ Meta tags and Open Graph support
- ✅ Structured data (JSON-LD)
- ✅ Sitemap.xml
- ✅ ARIA labels for screen readers
- ✅ Keyboard navigation support
- ✅ Semantic HTML structure

## License

Private - For personal use only

Made with ❤️ for Shubs & Alysha

