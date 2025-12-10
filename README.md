# Stardust to Sovereignty Website

Marketing and preorder website for Book One: The Cosmic Tapestry.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vercel** - Deployment

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Deployment

This project is deployed on Vercel and connected to `stardusttosovereignty.com`.

### Vercel Configuration

- **Root Directory:** `/` (root of this repository)
- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### Environment Variables

- `NEXT_PUBLIC_GA_ID` (optional) - Google Analytics ID

## Project Structure

```
├── app/              # Next.js App Router pages
├── components/       # React components
├── public/           # Static assets (images, etc.)
├── styles/           # Global styles
└── package.json      # Dependencies
```

## Features

- ✅ Preorder functionality with Formspree integration
- ✅ Responsive design with terminator-border styling
- ✅ SEO optimization (JSON-LD structured data, sitemap)
- ✅ Legal pages (Privacy Policy, Terms of Service)
- ✅ Console "Coming Soon" page
- ✅ Newsletter signup with Console early access incentive
- ✅ Custom 404 page
- ✅ Breadcrumbs navigation
- ✅ Analytics ready (Google Analytics)

## Future Console Integration

When the Console is ready, add environment variable:
- `NEXT_PUBLIC_CMS_BACKEND_URL` - Console API endpoint

## License

Copyright © 2025 Stardust to Sovereignty. All rights reserved.
