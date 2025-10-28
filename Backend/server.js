// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const lessonRoutes = require('./routes/lessons')

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);  // All auth routes here


app.get('/', (req, res) => {
  res.json({ message: 'Yeneta Kids API v1' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
