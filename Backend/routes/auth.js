// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { protect, authorize } = require('../middleware/auth');
require('dotenv').config();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, role, full_name, age, grade_level, phone, school, subject_specialty } = req.body;

  // Validation
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  if (!['admin', 'teacher', 'student'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    // Check if email exists
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.execute(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );
    const userId = result.insertId;

    // Insert profile based on role
    if (role === 'student') {
      if (!full_name) return res.status(400).json({ error: 'Full name required for student' });
      await db.execute(
        'INSERT INTO student_profiles (user_id, full_name, age, grade_level) VALUES (?, ?, ?, ?)',
        [userId, full_name, age || null, grade_level || null]
      );
    } else {
      // admin or teacher
      if (!full_name) return res.status(400).json({ error: 'Full name required' });
      await db.execute(
        'INSERT INTO profiles (user_id, full_name, phone, school, subject_specialty) VALUES (?, ?, ?, ?, ?)',
        [userId, full_name, phone || null, school || null, subject_specialty || null]
      );
    }

    res.status(201).json({
      message: 'User registered successfully',
      userId,
      role
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const [users] = await db.execute('SELECT id, password, role FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// === GET ALL USERS (Admin only) ===
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const [users] = await db.execute(`
      SELECT 
        u.id, u.email, u.role, u.created_at,
        p.full_name AS profile_name, p.phone, p.school, p.subject_specialty,
        sp.full_name AS student_name, sp.age, sp.grade_level, sp.total_stars
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN student_profiles sp ON u.id = sp.user_id
      ORDER BY u.created_at DESC
    `);

    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// === GET TEACHER'S STUDENTS ===
router.get('/my-students', protect, authorize('teacher'), async (req, res) => {
  try {
    const [students] = await db.execute(`
      SELECT 
        u.id, u.email,
        sp.full_name, sp.age, sp.grade_level, sp.total_stars
      FROM users u
      JOIN student_profiles sp ON u.id = sp.user_id
      WHERE u.role = 'student'
      ORDER BY sp.full_name
    `);

    res.json({ students });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// === GET MY PROFILE (Student) ===
router.get('/me', protect, authorize('student'), async (req, res) => {
  try {
    const [data] = await db.execute(`
      SELECT 
        u.email,
        sp.full_name, sp.age, sp.grade_level, sp.total_stars
      FROM users u
      JOIN student_profiles sp ON u.id = sp.user_id
      WHERE u.id = ?
    `, [req.user.id]);

    if (data.length === 0) return res.status(404).json({ error: 'Profile not found' });

    res.json({ profile: data[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;