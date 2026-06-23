const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and serving static assets
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Simple GET Route: System Info
app.get('/api/info', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Simple Express App',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// 2. Simple POST Route: Echo Message
app.post('/api/echo', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  res.json({
    status: 'success',
    echo: message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
