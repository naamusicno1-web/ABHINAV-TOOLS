# Setup Guide - ABHINAV TOOLS AND BOTS

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase Account
- GitHub Account

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/naamusicno1-web/ABHINAV-TOOLS.git
cd ABHINAV-TOOLS
```

### 2. Install All Dependencies
```bash
npm run install-all
```

### 3. Environment Configuration

#### Copy example environment file
```bash
cp .env.example .env
```

#### Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Realtime Database
4. Enable Cloud Storage
5. Copy your credentials to `.env` file

#### Setup Admin Password
```bash
# Generate bcrypt hash for password "abhinav22456"
# Run this in Node.js:
const bcrypt = require('bcrypt');
bcrypt.hash('abhinav22456', 10).then(hash => console.log(hash));

# Copy the hash to ADMIN_PASSWORD_HASH in .env
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:3000/admin

## Admin Panel Login
- URL: `http://localhost:3000/admin`
- Password: `abhinav22456`

## Features Configuration

### Social Media Links
Edit the social links in `backend/config/social.config.js`:
```javascript
module.exports = {
  instagram: 'https://instagram.com/yourusername',
  discord: 'https://discord.gg/yourserver'
};
```

### Background Image
Replace the Solo Leveling image in `frontend/public/images/background.png`

## Deployment

### Deploy to GitHub Pages
```bash
npm run build
git add .
git commit -m "Build: production release"
git push origin main
```

### Deploy to Vercel/Netlify
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

## Troubleshooting

### Port Already in Use
```bash
# Change port in backend/.env
PORT=5001
```

### Firebase Connection Issues
- Verify API keys are correct
- Check Firebase security rules
- Enable required APIs in Google Cloud Console

## Support
For issues and questions, please open a GitHub issue.
