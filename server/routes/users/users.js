const express = require('express');
const pool = require('../../config/db.js');
const router = express.Router();
const { getUsers, getUser, putUser, deleteUser } = require('./users.query.js');

router.get('/users', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(getUsers);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Aucun utilisateur.' });
        }

        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
    } finally {
        if (conn) conn.release();
    }
});

router.get('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(getUser, [userId]);

        if (rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur.' });
    } finally {
        if (conn) conn.release();
    }
});

router.put('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Le prénom, le nom de famille, l\'email et le mdp sont requis.' });
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(putUser, [name, email, userId]);

        if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({
        message: 'Utilisateur mis à jour avec succès !',
        userId,
        name,
        email,
        password
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur.' });
    } finally {
        if (conn) conn.release();
    }
});

router.delete('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(deleteUser, [userId]);

        if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        res.status(200).json({
        message: 'Utilisateur supprimé avec succès !',
        userId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur.' });
    } finally {
        if (conn) conn.release();
    }
});

module.exports = router;
