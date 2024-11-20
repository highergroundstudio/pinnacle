# 🏔 Pinnacle - Deal Management Platform

A professional, modern deal management and folder creation platform built with Next.js 14, TypeScript, and Tailwind CSS.

![Pinnacle Dashboard](https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2400&auto=format&fit=crop)

## ✨ Features

- 🚀 **Lightning Fast**: Built with Next.js 14 and Server Components
- 🎨 **Beautiful UI**: Crafted with Tailwind CSS and shadcn/ui
- 🔒 **Secure**: Server-side HubSpot integration
- 📝 **Smart Forms**: Auto-complete addresses with Google Maps API
- 📊 **Deal Management**: Track and manage deals efficiently
- 📄 **PDF Parsing**: Extract data from PDFs automatically
- 🧮 **Loan Calculator**: Built-in LTV calculator
- 🌙 **Dark Mode**: Full dark mode support
- 🐳 **Docker Ready**: Easy deployment with Docker

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pinnacle.git
cd pinnacle
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.local.example` to `.env.local` and fill in your API keys:
```bash
cp .env.local.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

## 🐳 Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up -d --build
```

2. Access the application at `http://localhost:3000`

## 🔑 Environment Variables

Required environment variables:

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key for address autocomplete
- `HUBSPOT_TOKEN`: HubSpot API token for CRM integration

## 📦 Tech Stack

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [HubSpot API](https://developers.hubspot.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Lucide Icons](https://lucide.dev/)

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.