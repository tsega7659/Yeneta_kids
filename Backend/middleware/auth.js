// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await db.execute('SELECT id, role FROM users WHERE id = ?', [decoded.id]);
    if (users.length === 0) return res.status(401).json({ error: 'User not found' });

    req.user = users[0];
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalid' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };
};

module.exports = { protect, authorize };