const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// For any other routes, serve the index.html from public directory
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Static files are being served from ${path.join(__dirname, 'public')}`);
}); 