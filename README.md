# IEEE MIT Bengaluru Website 🚀

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.12-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

The official website for the **IEEE MIT Bengaluru Student Branch** - a dynamic, modern web application showcasing IEEE activities, events, and societies to students and technology enthusiasts.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Components Explained](#key-components-explained)
- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

This website serves as the digital presence for the IEEE Student Branch at MIT Bengaluru. It provides:
- **Event Management**: Display upcoming and past events with filtering capabilities
- **Society Showcases**: Dedicated pages for 10 IEEE technical societies
- **Membership Information**: Details about joining IEEE
- **Articles & Resources**: Educational content and updates
- **Interactive UI**: Animated backgrounds and smooth user experience

**Perfect for portfolio presentations** - This README explains everything from scratch so you can confidently present this project to recruiters!

## ✨ Features

### 1. **Dynamic Event System**
- Real-time event data fetched from Supabase database
- Filter events by:
  - Society (10 different IEEE societies)
  - Date (year, month, specific date)
  - Event type (upcoming/past)
  - Search by title
- Pagination support for large event lists
- URL-based filtering (shareable links with filters pre-applied)

### 2. **Animated Background**
- Custom-built animated background using Canvas API and SimplexNoise algorithm
- 120 dynamic particles with gradient effects
- Performance-optimized rendering
- Customizable opacity and styling

### 3. **Society Pages**
Each of the 10 IEEE societies has a dedicated page:
- Antennas and Propagation Society
- Computer Society
- Computational Intelligence Society
- Engineering in Medicine and Biology Society
- Geoscience and Remote Sensing Society
- Microwave Theory and Technology Society
- Photonics Society
- Robotics and Automation Society
- Vehicular Technology Society
- Women in Engineering

### 4. **Loading Screen**
- Branded loading animation with IEEE colors
- Smooth fade-out transition
- 2.5-second display time

### 5. **Responsive Design**
- Mobile-first approach using Tailwind CSS
- Adaptive layouts for all screen sizes
- Touch-friendly navigation

## 🛠 Technology Stack

### Frontend Framework
- **React 19.1.1**: Latest React with improved performance and concurrent features
- **React Router DOM 7.8.1**: Client-side routing with nested routes

### Build Tools
- **Vite 7.1.2**: Lightning-fast build tool with HMR (Hot Module Replacement)
- **ESLint**: Code quality and consistency

### Styling
- **Tailwind CSS 4.1.12**: Utility-first CSS framework
- **@tailwindcss/vite**: Vite integration for Tailwind

### Backend/Database
- **Supabase**: PostgreSQL database with real-time capabilities
  - Event storage and retrieval
  - No backend server needed - direct client connection

### UI Components & Icons
- **Lucide React**: Beautiful icon set
- **React Icons**: Additional icon library
- **React Confetti**: Celebration effects

### Development Tools
- **Node.js**: JavaScript runtime
- **npm**: Package manager

## 🏗 Project Architecture

### Application Flow

```
index.html
    ↓
main.jsx (Entry Point)
    ↓
App.jsx (Loading Screen Logic)
    ↓
Router (react-router-dom)
    ↓
Layout Component (Navbar + Content + Footer)
    ↓
Pages (Home, Events, Membership, Articles, Societies)
```

### Routing Structure

```
/ (Home)
├── /events (All events with filters)
├── /membership (Join IEEE)
├── /articles (Resources)
├── /societies-list (All societies)
└── /societies/
    ├── /antennas-and-propagation
    ├── /computer-society
    ├── /computational-intelligence
    ├── /engineering-in-medicine-and-biology
    ├── /geoscience-and-remote-sensing
    ├── /microwave-theory-and-technology
    ├── /photonics-society
    ├── /robotics-and-automation
    ├── /vehicular-technology
    └── /women-in-engineering
```

### Data Flow

```
Supabase Database
    ↓
supabaseClient.js (API Configuration)
    ↓
Pages (Events, Home) - Fetch data
    ↓
Components (EventCard) - Display data
    ↓
User Interface
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v20 LTS or higher recommended)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/EngineerAditya/ieee-mitb-website.git
cd ieee-mitb-website
```

2. **Install dependencies**
```bash
npm install
```

This installs all required packages from `package.json`:
- React and React DOM
- React Router
- Tailwind CSS
- Supabase client
- Vite and build tools
- Development dependencies (ESLint, etc.)

3. **Start the development server**
```bash
npm run dev
```

The application will open at `http://localhost:5173` (Vite's default port).

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build in `dist/` folder |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview production build locally |

## 📁 Project Structure

```
ieee-mitb-website/
├── public/                      # Static assets
│   ├── ieee.svg                # IEEE logo (favicon)
│   ├── logo.png                # Site logo
│   ├── party-popper.svg        # Celebration icon
│   ├── folder/                 # Image assets
│   └── sbPhotos/               # Student branch photos
│
├── src/                        # Source code
│   ├── components/             # Reusable React components
│   │   ├── BackgroundShift.jsx    # Animated canvas background
│   │   ├── Cards.jsx              # Event card component
│   │   ├── Footer.jsx             # Site footer
│   │   ├── Layout.jsx             # Page layout wrapper
│   │   ├── LoadingScreen.jsx     # Initial loading animation
│   │   ├── Navbar.jsx             # Navigation bar
│   │   └── SocietiesPage.jsx     # Template for society pages
│   │
│   ├── pages/                  # Route-based pages
│   │   ├── Home.jsx               # Landing page
│   │   ├── Events.jsx             # Events listing with filters
│   │   ├── Membership.jsx         # Membership information
│   │   ├── Articles.jsx           # Articles/blog section
│   │   └── SocietiesList.jsx      # All societies overview
│   │
│   ├── societies/              # Individual society pages
│   │   ├── AntennasAndPropagationSociety.jsx
│   │   ├── ComputerSociety.jsx
│   │   ├── ComputationalIntelligenceSociety.jsx
│   │   ├── EngineeringInMedicineAndBiologySociety.jsx
│   │   ├── GeoscienceAndRemoteSensingSociety.jsx
│   │   ├── MicrowaveTheoryAndTechnologySociety.jsx
│   │   ├── PhotonicsSociety.jsx
│   │   ├── RoboticsAndAutomationSociety.jsx
│   │   ├── VehicularTechnologySociety.jsx
│   │   └── WomenInEngineering.jsx
│   │
│   ├── lib/                    # Utility libraries
│   │   └── supabaseClient.js      # Supabase configuration
│   │
│   ├── App.jsx                 # Root component with loading logic
│   ├── main.jsx                # Entry point + router setup
│   ├── App.css                 # Component-specific styles
│   └── index.css               # Global styles + Tailwind imports
│
├── index.html                  # HTML template
├── vite.config.js             # Vite configuration
├── eslint.config.js           # ESLint configuration
├── package.json               # Dependencies and scripts
├── package-lock.json          # Locked dependency versions
├── LICENSE                    # MIT License
└── README.md                  # This file
```

## 🔍 Key Components Explained

### 1. **App.jsx** - Application Bootstrap
**Purpose**: Controls the initial loading screen and renders the main application.

**How it works**:
```javascript
- Shows LoadingScreen for 2.5 seconds using useState + useEffect
- After timeout, fades out loading screen
- Renders RouterProvider with all routes
```

**Key Features**:
- Timer-based loading (can be extended for actual data loading)
- Smooth transition between loading and content

### 2. **main.jsx** - Application Entry Point
**Purpose**: Sets up React Router and defines all application routes.

**How it works**:
```javascript
- Creates browser router with createBrowserRouter
- Defines route hierarchy with Layout wrapper
- Exports router for use in App.jsx
- Renders root React component
```

**Key Features**:
- Centralized routing configuration
- Nested routes with shared Layout
- Easy to add new routes

### 3. **BackgroundShift.jsx** - Animated Background
**Purpose**: Creates an animated particle background using Canvas API.

**How it works**:
```javascript
1. Creates a canvas element
2. Implements SimplexNoise algorithm for smooth random motion
3. Spawns 120 animated circles with:
   - Random colors (blue/orange/green hues)
   - Varying sizes (80-280px radius)
   - Independent velocities
   - Lifespan (TTL - time to live)
4. Uses requestAnimationFrame for 60fps animation
5. Resets particles when they expire
```

**Technical Details**:
- SimplexNoise: Generates smooth, continuous noise for natural motion
- Gradient fills: Each particle has a radial gradient
- Performance optimized: Reuses particle properties instead of creating new objects

### 4. **LoadingScreen.jsx** - Initial Loading Animation
**Purpose**: Displays branded loading screen on app startup.

**How it works**:
```javascript
- Full-screen overlay (z-index: 9999)
- Gradient text effect using CSS background-clip
- CSS animation for fade-in
- Accepts fadeOut prop for exit transition
```

**Styling**:
- IEEE Blue (#00629B) to Manipal Orange (#FF6F00) gradient
- Responsive font sizing with clamp()
- 1-second fade-out transition

### 5. **Events.jsx** - Event Management System
**Purpose**: Display and filter events from Supabase database.

**How it works**:
```javascript
1. Fetches events from Supabase on mount
2. Separates into upcoming and past events
3. Provides filters:
   - Search by title
   - Filter by society
   - Filter by year/month/date
   - Filter by event type (upcoming/past/all)
4. Implements pagination (12 events per page)
5. Syncs filters with URL query parameters
```

**Key Features**:
- Real-time data from Supabase
- URL-based filtering (shareable links)
- Responsive card grid layout
- Error handling and loading states

### 6. **supabaseClient.js** - Database Connection
**Purpose**: Configure and export Supabase client for database operations.

**How it works**:
```javascript
- Imports Supabase SDK
- Configures with URL and anonymous key
- Exports singleton client instance
```

**Usage in components**:
```javascript
import { supabase } from '../lib/supabaseClient';

// Fetch data
const { data, error } = await supabase
  .from('events')
  .select('*')
  .order('date', { ascending: false });
```

### 7. **Layout.jsx** - Page Structure
**Purpose**: Provides consistent layout across all pages.

**How it works**:
```javascript
- Wraps all pages with Navbar and Footer
- Uses <Outlet /> for nested route rendering
- Includes BackgroundShift component
```

**Structure**:
```
BackgroundShift (animated background)
Navbar (top navigation)
<Outlet /> (page content goes here)
Footer (bottom links and info)
```

### 8. **Navbar.jsx** - Navigation Component
**Purpose**: Provides site-wide navigation with mobile responsiveness.

**Key Features**:
- Logo and branding
- Navigation links (Home, Events, Societies, Membership, Articles)
- Mobile hamburger menu
- Active route highlighting

### 9. **Cards.jsx** - Event Card Component
**Purpose**: Reusable card component for displaying events.

**Props**:
- title: Event name
- date: Event date/time
- location: Event venue
- description: Event details
- imageUrl: Event poster/image
- society: Organizing society

**Styling**:
- Card with hover effects
- Responsive image handling
- Truncated text with ellipsis

### 10. **Society Pages** - Individual Society Showcases
**Purpose**: Dedicated pages for each IEEE technical society.

**Common Structure**:
- Society logo/banner
- Description and mission
- Focus areas
- Past events (filtered by society)
- Join/Learn more CTAs

## 🔐 Environment Setup

### Supabase Configuration

The app connects to a Supabase database for event data. 

**⚠️ Security Best Practice**: The current implementation has database credentials in the source code. For production use, these should be moved to environment variables.

**To use your own Supabase instance**:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create an `events` table with schema:
   ```sql
   create table events (
     id uuid default uuid_generate_v4() primary key,
     title text not null,
     date timestamp with time zone not null,
     location text,
     description text,
     image_url text,
     society text,
     created_at timestamp with time zone default now()
   );
   ```
3. Get your project URL and anon key from Settings > API
4. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your-project-url-here
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. Update `src/lib/supabaseClient.js`:
   ```javascript
   const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
   const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
   ```
6. Add `.env` to `.gitignore` to prevent committing credentials

**Security Note**: The anon key is designed for client-side use. Row-level security (RLS) policies in Supabase control actual data access.

### Environment Variables (Recommended Setup)

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Then update `src/lib/supabaseClient.js` to use these variables instead of hardcoded values.

## 💻 Development Workflow

### 1. **Start Development Server**
```bash
npm run dev
```
- Opens at `http://localhost:5173`
- Hot Module Replacement (HMR) - instant updates without page refresh
- Fast refresh preserves React state

### 2. **Making Changes**

**Adding a new page**:
```javascript
// 1. Create component in src/pages/
// src/pages/NewPage.jsx
export default function NewPage() {
  return <div>New Page Content</div>;
}

// 2. Add route in src/main.jsx
import NewPage from './pages/NewPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // ... existing routes
      { path: '/new-page', element: <NewPage /> },
    ]
  }
]);
```

**Adding a new component**:
```javascript
// Create in src/components/MyComponent.jsx
export default function MyComponent({ prop1, prop2 }) {
  return <div>{/* component code */}</div>;
}

// Use in any page
import MyComponent from '../components/MyComponent';
```

### 3. **Code Quality**
```bash
# Check for linting errors
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### 4. **Building for Production**
```bash
npm run build
```
- Creates optimized build in `dist/` folder
- Minifies JavaScript and CSS
- Optimizes images and assets
- Tree-shakes unused code

### 5. **Preview Production Build**
```bash
npm run preview
```
- Serves production build locally
- Test before deployment
- Opens at `http://localhost:4173`

## 🌐 Deployment

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite - no configuration needed
6. Click "Deploy"

**Automatic deployments**: Every push to `main` branch auto-deploys.

### Option 2: Netlify

1. Build the project: `npm run build`
2. Visit [netlify.com](https://netlify.com)
3. Drag and drop the `dist/` folder
4. Or connect GitHub for automatic deployments

**Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

### Option 3: GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Update `vite.config.js`:
   ```javascript
   export default defineConfig({
     base: '/ieee-mitb-website/',
     plugins: [react(), tailwindcss()]
   })
   ```
4. Deploy: `npm run deploy`

### Option 4: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
EXPOSE 3000
```

Build and run:
```bash
docker build -t ieee-website .
docker run -p 3000:3000 ieee-website
```

## 🐛 Troubleshooting

### Issue: Development server won't start

**Error**: `Port 5173 is already in use`

**Solution**:
```bash
# Find and kill the process
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Issue: Build fails with memory error

**Error**: `JavaScript heap out of memory`

**Solution**:
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Issue: Supabase connection fails

**Error**: `Invalid API key` or `Failed to fetch`

**Solution**:
1. Check Supabase URL and key in `supabaseClient.js`
2. Verify Supabase project is active
3. Check browser console for CORS errors
4. Verify RLS policies allow anonymous access (if needed)

### Issue: Hot reload not working

**Solution**:
1. Check if you're editing the correct file
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Clear browser cache
4. Check for syntax errors in code

### Issue: Styling not applied

**Solution**:
1. Verify Tailwind classes are correct
2. Check if `index.css` imports Tailwind:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Restart dev server to regenerate CSS

### Issue: Router not working after deployment

**Error**: 404 on page refresh

**Solution**: Configure server to redirect all requests to `index.html`

**Vercel**: Add `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify**: Add `_redirects` in `public/`:
```
/*    /index.html   200
```

## 🤝 Contributing

This is a student branch project. Contributions are welcome!

### How to contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly: `npm run build` and `npm run lint`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Coding Standards:

- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic
- Keep components small and focused
- Test on multiple screen sizes
- Run ESLint before committing

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📞 Contact & Support

- **IEEE MIT Bengaluru**: [https://ieee-mitb-website.vercel.app/]
- **Developer**: [https://github.com/EngineerAditya]
- **Issues**: [GitHub Issues](https://github.com/EngineerAditya/ieee-mitb-website/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by IEEE MIT Bengaluru Student Branch**
