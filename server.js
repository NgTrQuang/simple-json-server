const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const env = require('dotenv');

env.config();

const heartController = require('./controllers/heartController');
const uploadController = require('./controllers/uploadController');

const app = express();
const PORT = process.env.PORT || 8000; // bạn có thể đổi port nếu cần

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Route
app.post('/upload/heart-control', heartController.handleHeartbeat);
app.post('/upload/record', uploadController.handleUpload);

// 🆕 API: đọc file log và trả về JSON
app.get('/api/logs', (req, res) => {
  const logPath = path.join(__dirname, 'logs/device_snapshot.log');
  if (!fs.existsSync(logPath)) {
    return res.json({ data: [], message: '⚠️ Chưa có file log nào.' });
  }

  try {
    const lines = fs.readFileSync(logPath, 'utf8').trim().split('\n');
    const parsed = lines.map(line => {
      // Mỗi dòng có dạng: [2025-10-30T07:45:12.345Z] UPLOAD: {json}
      const jsonPart = line.split('UPLOAD:')[1];
      if (!jsonPart) return null;
      try {
        const obj = JSON.parse(jsonPart);
        obj._logged_at = line.match(/\[(.*?)\]/)?.[1]; // Thêm thời gian log
        return obj;
      } catch (e) {
        return { error: 'Invalid JSON', raw: line };
      }
    }).filter(Boolean);

    res.json({ data: parsed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🆕 Giao diện xem log
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Run server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Camera server is running on http://0.0.0.0:${PORT}`);
});
