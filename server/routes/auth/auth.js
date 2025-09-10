const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../../config/db.js');
const router = express.Router();
const { createUser, getUserByEmail } = require('./auth.query.js');
require('dotenv').config();

// Register endpoint
router.post('/auth/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name || !role)
    return res.status(400).json({ msg: 'Bad parameter' });

  try {
    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // INSERT user
    const { rows } = await pool.query(createUser, [email, hash, name, role]);
    const user = rows[0];

    // JWT with role
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET, { expiresIn: '7d' });

    return res.status(201).json({ token });
  } catch (err) {
    console.error('Internal server error:', err);
    if (err.code === '23505') return res.status(409).json({ msg: 'Account already exists' });
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

// Login endpoint
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'Bad parameter' });

  try {
    const { rows } = await pool.query(getUserByEmail, [email]);
    if (rows.length === 0) return res.status(404).json({ msg: 'Not found' });

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token });
  } catch (err) {
    console.error('Internal server error:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
