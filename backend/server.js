const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const { initialize: initializeDB } = require('./db');
const basicAuth = require('express-basic-auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API routes (no auth)
app.use('/api', routes);

// Health check endpoint (no auth)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: require('./package.json').version || 'unknown'
  });
});

// Basic auth middleware for static content if enabled
if (config.auth.static.enabled) {
  // Apply auth to all non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    
    basicAuth({
      users: { [config.auth.static.username]: config.auth.static.password },
      challenge: true,
      realm: 'ClickHouse Dashboard'
    })(req, res, next);
  });
}

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// For any other routes, serve the index.html from public directory
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = config.server.port;

// Initialize the database connection before starting the server
async function startServer() {
  try {
    // Initialize database connection
    const dbInitialized = await initializeDB();
    if (!dbInitialized) {
      console.warn('WARNING: Database connection failed, some features may not work');
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Static files are being served from ${path.join(__dirname, 'public')}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      if (config.auth.static.enabled) {
        console.log(`Basic authentication enabled for static content`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 