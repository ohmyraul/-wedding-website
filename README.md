# Shubs & Alysha Wedding Website

A beautiful, hand-drawn style wedding website built with React, Vite, and Tailwind CSS.

## Features

- ✨ Hand-drawn, sketchy design aesthetic
- 📱 Fully responsive design
- 🎨 Custom watercolor backgrounds and animations
- 👨‍👩‍👧‍👦 Family mode with exclusive sections
- 📝 RSVP form
- 🗺️ Travel information and recommendations
- ❓ FAQ section
- 🎉 Celebration timeline

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

You can deploy this website to:
- **Vercel**: Connect your GitHub repo and deploy automatically
- **Netlify**: Drag and drop the `dist` folder after building
- **GitHub Pages**: Use GitHub Actions to build and deploy

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)
- Google Fonts (Patrick Hand, Quicksand, La Belle Aurore)

## License

Private - For personal use only

Made with ❤️ for Shubs & Alysha

