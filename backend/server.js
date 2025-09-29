const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || '*'
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests' }
});
app.use('/api/', limiter);

// RapidAPI Configuration
const axios = require('axios');
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

let downloadHistory = [];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Instagram Downloader API is running',
    timestamp: new Date().toISOString()
  });
});

// Fetch Instagram Media
app.post('/api/fetch-media', async (req, res) => {
  try {
    const { url, format } = req.body;

    if (!url) {
      return res.status(400).json({ 
        success: false,
        error: 'URL is required' 
      });
    }

    const instagramPattern = /instagram\.com\/(p|reel|tv|stories)\/[A-Za-z0-9_-]+/;
    if (!instagramPattern.test(url)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid Instagram URL' 
      });
    }

    const options = {
      method: 'GET',
      url: `https://${RAPIDAPI_HOST}/get-info-rapidapi`,
      params: { url: url },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      },
      timeout: 15000
    };

    const response = await axios.request(options);
    const data = response.data;

    const mediaData = {
      type: format || 'video',
      thumbnail: data.thumbnail_url || data.display_url,
      videoUrl: data.video_url || data.download_url,
      title: data.title || 'Instagram Media',
      username: data.owner?.username || '@user',
      duration: data.video_duration || '00:00'
    };

    res.json({
      success: true,
      media: mediaData
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch media'
    });
  }
});

// Download Media
app.post('/api/download', async (req, res) => {
  try {
    const { url, format, resolution } = req.body;

    if (!url) {
      return res.status(400).json({ 
        success: false,
        error: 'URL is required' 
      });
    }

    const historyItem = {
      id: Date.now(),
      url,
      format,
      resolution,
      timestamp: new Date().toISOString()
    };
    
    downloadHistory.push(historyItem);
    
    if (downloadHistory.length > 100) {
      downloadHistory = downloadHistory.slice(-100);
    }

    res.json({
      success: true,
      message: 'Download initiated'
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to download'
    });
  }
});

// Get History
app.get('/api/history', (req, res) => {
  res.json({
    success: true,
    history: downloadHistory.slice(-10).reverse()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => console.log('Server closed'));
});
