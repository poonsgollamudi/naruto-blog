# Naruto Blog - Full-Stack Application

A modern React blog application with AI-powered content generation, real-time post management, and MongoDB storage. Features automated weekly posts using Anthropic Claude AI and a rich text editor for manual post creation.

## ✨ Features

- **AI-Powered Content**: Weekly automated posts via Anthropic Claude API
- **Rich Text Editor**: Markdown editor with formatting toolbar and emoji picker
- **Real-time Management**: Create, edit, and delete posts with live updates
- **MongoDB Integration**: Persistent data storage with MongoDB Atlas
- **Security First**: Rate limiting, input validation, and CORS protection
- **Responsive Design**: Mobile-friendly interface with Naruto theme
- **Image Integration**: Dynamic hero images from Unsplash based on tags

## 🏗️ Architecture

- **Frontend**: Vite + React with modern CSS
- **Backend**: Express.js with security middleware
- **Database**: MongoDB with Mongoose ODM  
- **AI Integration**: Anthropic Claude for content generation
- **Deployment**: Production-ready with PM2 and Nginx support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)  
- Anthropic API key for AI features

### Local Development

1. **Clone and Setup**
   ```powershell
   git clone <your-repo-url>
   cd naruto-blog
   npm run deploy:setup
   ```

2. **Environment Configuration**
   ```powershell
   cp .env.example .env
   # Edit .env with your API keys and database URL
   ```

3. **Start Development Servers**
   ```powershell
   # Frontend (http://localhost:5173)
   npm run dev
   
   # Backend (http://localhost:5000) - separate terminal
   npm run dev:server
   ```

4. **Run Tests**
   ```powershell
   npm run test
   ```

## 🔧 Environment Setup

Copy `.env.example` to `.env` and configure:

```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
MONGODB_URI=mongodb://localhost:27017/naruto-blog
PORT=5000
CORS_ORIGINS=http://localhost:5173
```

## 🚢 Production Deployment

### Option 1: Cloud Platforms (Recommended)

**Frontend (Vercel/Netlify)**
```bash
npm run build
# Deploy dist/ folder
```

**Backend (Railway/Heroku)**  
```bash
cd server
# Deploy with environment variables
```

### Option 2: VPS Deployment

```bash
# Install dependencies
npm run deploy:setup

# Build production assets
npm run build:production

# Start with PM2
cd server && pm2 start ecosystem.config.js
```

## 🔒 Security Features

- **Rate Limiting**: API protection against abuse
- **Input Validation**: XSS and injection prevention
- **CORS**: Configurable cross-origin policies
- **Helmet.js**: Security headers
- **MongoDB Sanitization**: NoSQL injection protection
- **Environment Isolation**: Secure configuration management

## 🤖 AI Features

- **Automated Posts**: Weekly content generation via Anthropic Claude
- **Scheduling**: Configurable cron jobs for post creation
- **Content Quality**: AI-generated Naruto-themed posts with proper formatting

## 📊 API Endpoints

```
GET    /api/posts          # Get all posts
GET    /api/posts/:id      # Get single post  
POST   /api/posts          # Create post
PATCH  /api/posts/:id      # Update post
DELETE /api/posts/:id      # Delete post
GET    /health             # Health check
```

## 🛠️ Development Scripts

```json
{
  "dev": "Start frontend dev server",
  "dev:server": "Start backend dev server", 
  "build": "Build frontend for production",
  "deploy:setup": "Install all dependencies",
  "build:production": "Full production build"
}
```

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection working
- [ ] API keys valid and secure
- [ ] CORS configured for production domain
- [ ] HTTPS certificate installed
- [ ] Rate limiting enabled
- [ ] Error monitoring setup
- [ ] Backup strategy implemented

For detailed deployment instructions, see the full deployment guide in this README.
   - You can customize the image service in `src/utils/imageService.js`

## Notes & next steps
- Add pagination, tagging page, RSS feed, and a small admin interface (or use Git-based CMS like Netlify CMS) to create posts.