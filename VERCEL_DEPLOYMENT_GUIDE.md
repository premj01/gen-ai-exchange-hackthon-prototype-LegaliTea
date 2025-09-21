# Vercel Deployment Guide for LegaliTea

## Overview

This guide will help you deploy your React + Express application on Vercel. The project has been configured to work with Vercel's serverless architecture.

## Key Changes Made

### 1. Fixed vercel.json Configuration

- Changed `distDir` from `"build"` to `"dist"` to match Vite's output directory
- Updated API build pattern to `"api/**/*.js"` for better coverage
- Simplified routing configuration

### 2. Updated Vite Configuration

- Added explicit build output directory configuration
- Ensured assets are properly organized

### 3. Cleaned Up API Structure

- Removed static file serving from Express (handled by Vercel)
- Simplified API entry point for serverless functions
- Removed unnecessary path dependencies

### 4. Added Build Scripts

- Added `vercel-build` script for Vercel deployment

## Deployment Steps

### Prerequisites

1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`

### Environment Variables

Make sure to set these environment variables in your Vercel dashboard:

- `GOOGLE_AI_API_KEY` (for your AI analysis service)
- Any other API keys your application needs

### Deployment Commands

#### Option 1: Deploy via Vercel CLI

```bash
# In your project root
vercel

# For production deployment
vercel --prod
```

#### Option 2: Deploy via Git Integration

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration
3. Set environment variables in the Vercel dashboard
4. Deploy

### Project Structure for Vercel

```
├── api/
│   ├── index.js          # Main API entry point
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── services/         # Business logic
├── src/                  # React source code
├── dist/                 # Built React app (generated)
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies and scripts
```

## How It Works

### Frontend (React)

- Built with Vite and output to `dist/` directory
- Served as static files by Vercel
- Handles client-side routing

### Backend (Express API)

- API routes are in the `api/` directory
- Each file in `api/` becomes a serverless function
- `api/index.js` handles all `/api/*` routes
- Express app is exported for Vercel's serverless environment

### Routing

- `/api/*` routes → Express API serverless functions
- All other routes → React app (SPA fallback)

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation passes
   - Verify environment variables are set

2. **API Not Working**

   - Check that API routes are properly exported
   - Verify CORS configuration
   - Check Vercel function logs

3. **Static Files Not Loading**
   - Ensure Vite build outputs to `dist/` directory
   - Check that `vercel.json` points to correct directory

### Debugging

- Use `vercel logs` to check function logs
- Check Vercel dashboard for deployment status
- Use `vercel dev` for local testing

## Local Development

```bash
# Start development server
npm run dev

# Test with Vercel locally
vercel dev

# Build and preview
npm run build
npm run preview
```

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] All API routes tested
- [ ] React app builds successfully
- [ ] CORS configured properly
- [ ] Error handling in place
- [ ] Rate limiting configured

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify all configuration files
3. Test API endpoints individually
4. Check browser console for frontend errors
