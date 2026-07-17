# Deployment Guide - ABHINAV TOOLS AND BOTS

## Overview
This guide explains how to deploy ABHINAV TOOLS AND BOTS to GitHub Pages with automatic updates.

## Prerequisites
- GitHub account
- Git installed
- Node.js 16+
- npm or yarn

## Step 1: Firebase Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `abhinav-tools-bots`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Required Services
1. Go to Build → Realtime Database
   - Click "Create Database"
   - Start in test mode
   - Choose region closest to you
   - Click "Enable"

2. Go to Build → Storage
   - Click "Get Started"
   - Start in test mode
   - Click "Done"

### 1.3 Generate Service Account Key
1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. A JSON file will download
4. Keep this file safe (don't commit to GitHub)

### 1.4 Get Firebase Configuration
1. Go to Project Settings → General
2. Scroll down to "Your apps"
3. Click Firebase SDK snippet
4. Copy the config

## Step 2: Environment Configuration

### 2.1 Backend (.env)
Create `backend/.env`:
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secret_key_here

# Firebase
FIREBASE_PROJECT_ID=abhinav-tools-bots
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_email
FIREBASE_STORAGE_BUCKET=abhinav-tools-bots.appspot.com

# Admin
ADMIN_PASSWORD_HASH=$2b$10$hashed_password_here
```

### 2.2 Frontend (.env)
Create `frontend/.env`:
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_FIREBASE_PROJECT_ID=abhinav-tools-bots
```

### 2.3 Generate Admin Password Hash
```bash
# Run in Node.js
node -e "require('bcrypt').hash('abhinav22456', 10).then(h => console.log(h))"
```
Copy the output to `ADMIN_PASSWORD_HASH` in backend/.env

## Step 3: Deploy Frontend to GitHub Pages

### 3.1 Update Frontend Configuration
Edit `frontend/package.json`:
```json
{
  "homepage": "https://naamusicno1-web.github.io/ABHINAV-TOOLS"
}
```

### 3.2 Build and Deploy
```bash
# Build the frontend
cd frontend
npm run build

# Commit changes
git add -A
git commit -m "Build: production release for GitHub Pages"
git push origin main
```

### 3.3 Enable GitHub Pages
1. Go to Repository Settings → Pages
2. Under "Build and deployment":
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)
3. Click "Save"

Your site will be available at: `https://naamusicno1-web.github.io/ABHINAV-TOOLS`

## Step 4: Deploy Backend

### Option A: Deploy to Heroku (Recommended for Backend)
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create abhinav-tools-backend

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set FIREBASE_PROJECT_ID=abhinav-tools-bots
# ... add all environment variables

# Deploy
git push heroku main
```

### Option B: Deploy to Railway
1. Go to [Railway](https://railway.app/)
2. Create new project
3. Connect GitHub repository
4. Configure environment variables
5. Deploy

### Option C: Deploy to Render
1. Go to [Render](https://render.com/)
2. Create new Web Service
3. Connect GitHub repository
4. Configure environment variables
5. Deploy

## Step 5: GitHub Actions Automation

The repository includes automatic deployment workflow (`.github/workflows/deploy.yml`).

### Enable Actions
1. Go to Repository → Actions
2. Click "I understand my workflows, go ahead and enable them"

### Workflow Features
- Automatically builds on push to `main`
- Deploys to GitHub Pages
- Real-time updates for all members

## Step 6: Testing

### Local Testing
```bash
# Frontend
cd frontend
npm start
# Visit http://localhost:3000

# Backend
cd backend
npm run dev
# API available at http://localhost:5000/api
```

### Production Testing
1. Visit: `https://naamusicno1-web.github.io/ABHINAV-TOOLS`
2. Test public page
3. Click "Admin Panel"
4. Enter password: `abhinav22456`
5. Try uploading a test file

## Step 7: Real-time Updates for All Members

### How It Works
- Frontend polls for updates every 5 seconds
- When admin uploads/edits/deletes → database updates
- All connected members see changes automatically
- No page refresh needed

### Configuration
Edit `frontend/src/components/PublicPage.tsx`:
```typescript
// Change poll interval (currently 5000ms)
const interval = setInterval(fetchFilesAndSettings, 5000);
```

## Troubleshooting

### Build Fails
- Check Node.js version: `node --version` (should be 16+)
- Clear cache: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

### GitHub Pages Not Updating
- Check Actions tab for build errors
- Verify homepage in package.json
- Clear browser cache (Ctrl+Shift+Delete)

### Backend Not Connected
- Check API URL in frontend/.env
- Verify CORS is enabled in backend
- Check Firebase credentials

### Admin Login Not Working
- Verify admin password hash is set
- Check JWT_SECRET is configured
- Review backend logs

## Maintenance

### Updating Settings
1. Go to Admin Panel
2. Click "Settings"
3. Update Instagram/Discord links
4. Save (updates for all members instantly)

### Managing Files
- Admin Panel → Files tab
- Upload: Upload new files
- Edit: Update file info
- Delete: Remove files (updates for all)
- Search: Find files quickly

### Monitoring
- Check GitHub Actions for deployment status
- Monitor Firebase Console for usage
- Review backend logs if available

## Support & Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [GitHub Pages Guide](https://pages.github.com)

## Security Notes
- Keep admin password secret
- Never commit `.env` files to GitHub
- Use HTTPS for all connections
- Keep dependencies updated
- Monitor Firebase security rules
