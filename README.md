# Rishan Menezes - Personal Portfolio

A modern, full-stack personal portfolio website showcasing full-stack development and AI/ML projects. Built with React, TypeScript, Express, and featuring animated backgrounds, GitHub project integration, and a premium glassmorphism design.

## 🌟 Features

- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark/Light Theme**: Theme switching with system preference detection
- **Animated Background**: Performance-optimized canvas-based bubble animations with parallax effects
- **GitHub Integration**: Real-time project fetching from GitHub API with curated project highlights
- **Contact Form**: EmailJS-powered contact form with validation
- **Premium UI**: Glassmorphism design with gradient borders and smooth animations
- **Performance Optimized**: Lazy loading, code splitting, and reduced motion support
- **Error Handling**: Comprehensive error boundary with graceful fallbacks
- **Accessibility**: Keyboard navigation, screen reader support, and ARIA labels

## 🛠 Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **TypeScript 5.6.3** - Type safety
- **Vite 7.1.9** - Build tool and dev server
- **Tailwind CSS 4.1.14** - Styling
- **Framer Motion 12.23.24** - Animations
- **Wouter 3.3.5** - Lightweight routing
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **EmailJS 4.4.1** - Email service integration
- **next-themes 0.4.6** - Theme management

### Backend
- **Express 5.0.1** - Web framework
- **Node.js** - Runtime environment
- **Drizzle ORM 0.39.3** - Database ORM
- **PostgreSQL** - Database (via pg)
- **Passport 0.7.0** - Authentication
- **express-session 1.18.1** - Session management

### Development Tools
- **ESBuild** - Server bundling
- **Drizzle Kit** - Database migrations
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes
- **Cross-env** - Environment variable management

## 📁 Project Structure

```
rishan-portfolio/
├── client/                      # Frontend React application
│   ├── public/                 # Static assets
│   │   ├── favicon.png
│   │   ├── opengraph.jpg
│   │   └── profile.jpg
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ui/            # Shadcn UI components (50+ components)
│   │   │   ├── AnimatedBackground.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── GitHubProjects.tsx
│   │   │   └── GitHubProjectsSkeleton.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   ├── lib/               # Utility functions
│   │   │   └── utils.ts
│   │   ├── pages/             # Page components
│   │   │   ├── home.tsx       # Main portfolio page
│   │   │   └── not-found.tsx  # 404 page
│   │   ├── App.tsx            # Root component with routing
│   │   ├── main.tsx           # Application entry point
│   │   └── index.css          # Global styles with Tailwind
│   └── index.html             # HTML template
├── server/                     # Backend Express server
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # API route definitions
│   ├── static.ts              # Static file serving
│   └── vite.ts                # Vite dev server integration
├── shared/                     # Shared TypeScript code
│   └── schema.ts              # Database schema definitions
├── script/                     # Build scripts
│   └── build.ts               # Production build script
├── attached_assets/            # Additional assets
├── components.json             # Shadcn UI configuration
├── drizzle.config.ts          # Drizzle ORM configuration
├── netlify.toml               # Netlify deployment configuration
├── package.json               # Project dependencies
├── postcss.config.js          # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
└── .gitignore                 # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rishan-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   PORT=5000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

### Available Scripts

- `npm run dev` - Start development server (backend + Vite)
- `npm run dev:client` - Start Vite dev server only (port 5000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🏗 Architecture

### Frontend Architecture

- **Component-Based**: Modular React components with clear separation of concerns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks for local state, theme management via next-themes
- **Styling**: Tailwind CSS with custom utility classes for glassmorphism effects
- **Animations**: Framer Motion for smooth transitions and micro-interactions

### Backend Architecture

- **Express Server**: RESTful API with middleware for JSON parsing and logging
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with local strategy for user authentication
- **Session Management**: express-session with memorystore for session storage
- **Static Files**: Serves built React assets in production

### Key Components

#### AnimatedBackground
- Canvas-based animated bubble system
- Performance-optimized with device-aware rendering
- Parallax effects based on scroll position and mouse movement
- Theme-aware color schemes
- Respects `prefers-reduced-motion` for accessibility

#### GitHubProjects
- Fetches projects from GitHub API with caching
- Curated project display with detailed descriptions
- Featured project highlighting
- Category filtering (Full Stack vs AI/ML)
- Responsive grid layout with skeleton loading states

#### ErrorBoundary
- React error boundary for graceful error handling
- Development-mode error details
- User-friendly error recovery UI
- Comprehensive error logging

## 🎨 Design System

### Theme Configuration
- **Light Theme**: Clean, recruiter-friendly design with crisp colors
- **Dark Theme**: Deep, glassy aesthetic with premium feel
- **Custom Properties**: HSL-based color system for easy theming
- **Typography**: Inter (sans), Space Grotesk (display), JetBrains Mono (code)

### Utility Classes
- `.glass` - Glassmorphism effect with backdrop blur
- `.card-elevate` - Hover elevation with smooth transitions
- `.gradient-border` - Animated gradient borders
- `.text-gradient` - Gradient text with shimmer animation
- `.shadow-premium` - Multi-layer shadow system

## 📱 Responsive Design

- **Mobile-First**: Progressive enhancement from mobile to desktop
- **Breakpoints**: 768px (mobile/tablet), 1024px (tablet/desktop)
- **Touch Optimization**: Reduced animations on mobile devices
- **Performance**: Device-aware rendering based on hardware capabilities

## 🔒 Security Features

- **Input Validation**: Zod schemas for data validation
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM
- **Session Security**: Secure session management with HttpOnly cookies
- **CORS**: Configured cross-origin resource sharing
- **Environment Variables**: Sensitive data in environment variables

## 🚀 Deployment

### Netlify Deployment
The project is configured for Netlify deployment via `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist/public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Manual Deployment
1. Build the project: `npm run build`
2. The output will be in `dist/public`
3. Deploy the `dist` folder to your hosting service

## 📊 Performance Optimizations

- **Code Splitting**: Lazy loading of heavy components
- **Tree Shaking**: ESBuild removes unused code
- **Image Optimization**: Responsive images with proper formats
- **Bundle Analysis**: Optimized dependencies with external allowlist
- **Request Caching**: GitHub API responses cached for 10 minutes
- **Animation Throttling**: Frame rate limiting based on device performance

## 🧪 Testing Considerations

While the project doesn't currently include automated tests, the architecture supports:
- Component testing with React Testing Library
- E2E testing with Playwright or Cypress
- API testing with Supertest
- Type checking via TypeScript (`npm run check`)

## 🔧 Configuration Files

- **tsconfig.json**: TypeScript configuration with path aliases
- **vite.config.ts**: Vite build configuration with custom aliases
- **drizzle.config.ts**: Database ORM configuration
- **components.json**: Shadcn UI component configuration
- **postcss.config.js**: PostCSS processing with Tailwind and Autoprefixer
- **netlify.toml**: Deployment configuration for Netlify

## 📝 License

MIT License - See LICENSE file for details

## 👤 Author

**Rishan Menezes**
- Third Year Computer Science & Engineering Student
- Maharaja Institute of Technology, Mysore
- Full Stack Developer with AI/ML integration expertise
- Location: Mysuru, Karnataka, India

## 🔗 Links

- [LinkedIn](https://www.linkedin.com/in/rishan-menezes/)
- [GitHub](https://github.com/rishanmenezes/)
- [LeetCode](https://leetcode.com/u/rishanmenezes/)
- [Instagram](https://www.instagram.com/rizzshhan/)
- Email: rishanmenezes05@gmail.com

## 🤝 Contributing

This is a personal portfolio project, but suggestions and improvements are welcome. Feel free to open issues or submit pull requests for any enhancements.

## 📄 Project Highlights

### Featured Projects
1. **EcoFinds** - E-commerce platform with real-time inventory
2. **Intent & Trajectory Prediction** - PyTorch-based autonomous driving ML model
3. **SkySmart** - Flight comparison tool with price tracking
4. **AI Study Companion** - RAG-powered study assistant

### Technical Achievements
- Full-stack development with React, TypeScript, Node.js
- AI/ML integration with Python, PyTorch, FastAPI
- Database design with PostgreSQL and Prisma ORM
- Real-time features and API integrations
- Performance optimization and accessibility focus

---

Built with ❤️ using modern web technologies and best practices.
