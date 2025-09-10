const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../../config/db.js');
const router = express.Router();
const { createUser, getUserByEmail } = require('./auth.query.js');

// Register endpoint
router.post('/auth/register', async (req, res) => {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role)
        return res.status(400).json({ msg: 'Bad parameter' });

    let conn;
    try {
        conn = await pool.getConnection();

        // Hash password
        const hash = await bcrypt.hash(password, 10);

        // INSERT user including role
        const insertResult = await conn.query(createUser, [email, hash, name, role]);
        console.log('Insert Result:', insertResult);

        // SELECT user to generate token
        const results = await conn.query(getUserByEmail, [email]);
        const user = results[0];

        // Include role in JWT payload
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.SECRET,
            { expiresIn: '7d' }
        );

        console.log('New user:', user);
        console.log('Token of the newly registered user:', token);

        return res.status(201).json({ token });
    } catch (err) {
        console.error('Internal server error:', err);
        if (err.code === 'ER_DUP_ENTRY')
            return res.status(409).json({ msg: 'Account already exists' });
        return res.status(500).json({ msg: 'Internal server error' });
    } finally {
        if (conn) {
            conn.release();
            console.log('Connection released to pool.');
        }
    }
});

// Login endpoint
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ msg: 'Bad parameter' });

    let conn;
    try {
        conn = await pool.getConnection();

        const results = await conn.query(getUserByEmail, [email]);

        if (results.length === 0) {
            console.log('Not found');
            return res.status(404).json({ msg: 'Not found' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch || password === user.password) {
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.SECRET,
                { expiresIn: '7d' }
            );
            console.log('Token generated:', token);
            return res.status(200).json({ token });
        } else {
            console.log('Invalid credentials');
            return res.status(401).json({ msg: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Internal server error:', err);
        return res.status(500).json({ msg: 'Internal server error' });
    } finally {
        if (conn) {
            conn.release();
            console.log('Connection released to pool.');
        }
    }
});

module.exports = router;
