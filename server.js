const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const heartController = require('./controllers/heartController');
const uploadController = require('./controllers/uploadController');

const app = express();
const PORT = 8000; // bạn có thể đổi port nếu cần

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Route
app.post('/camera/upload', heartController.handleHeartbeat);
app.post('/camera/heart', uploadController.handleUpload);

// Run server
app.listen(PORT, () => {
  console.log(`✅ Camera server is running on http://localhost:${PORT}`);
});
