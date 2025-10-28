// backend/routes/lessons.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, authorize } = require('../middleware/auth');

// GET lessons by subject, level, sublevel
router.get('/', protect, async (req, res) => {
  const { subject, level, sublevel } = req.query;
  const studentId = req.user.role === 'student' ? req.user.id : null;

  try {
    let query = `
      SELECT l.*, p.stars_earned, p.completed
      FROM lessons l
      LEFT JOIN progress p ON l.id = p.lesson_id AND p.student_id = ?
      WHERE 1=1
    `;
    const params = [studentId || null];

    if (subject) {
      query += ' AND l.subject_id = (SELECT id FROM subjects WHERE name = ?)';
      params.push(subject);
    }
    if (level) {
      query += ' AND l.level = ?';
      params.push(level);
    }
    if (sublevel) {
      query += ' AND l.sublevel = ?';
      params.push(sublevel);
    }

    const [lessons] = await db.execute(query, params);
    res.json({ lessons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;