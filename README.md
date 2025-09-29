# 📸 Instagram Downloader

تطبيق ويب احترافي لتحميل محتوى إنستغرام (فيديوهات، ريلز، قصص، صور شخصية) بجودة عالية.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

## ✨ المميزات

- 📹 تحميل الفيديوهات والريلز بجودات متعددة (480p, 720p, 1080p)
- 🎵 استخراج الصوت فقط (MP3)
- 📸 تحميل القصص قبل انتهاء صلاحيتها
- 🖼️ تحميل الصور الشخصية بجودة HD
- 🌍 دعم متعدد اللغات (English & العربية)
- 📱 تصميم متجاوب يعمل على جميع الأجهزة
- ⚡ تحميل سريع وآمن
- 📊 سجل التحميلات

## 🛠️ التقنيات المستخدمة

### Frontend
- React 18
- Vite
- TailwindCSS
- Lucide React
- Axios

### Backend
- Node.js
- Express
- Axios
- Express Rate Limit
- Helmet
- CORS

## 📦 التثبيت والتشغيل

### Backend
```bash
cd backend
npm install
npm run dev
cd frontend
npm install
npm run dev
cat > backend/package.json << 'EOF'
{
  "name": "instagram-downloader-backend",
  "version": "1.0.0",
  "description": "Backend API for Instagram Downloader",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [
    "instagram",
    "downloader",
    "api",
    "video"
  ],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "axios": "^1.6.0",
    "dotenv": "^16.3.1",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  }
}
