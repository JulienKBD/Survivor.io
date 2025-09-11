const express = require('express');
const pool = require('../../config/db.js');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { getUsers, getUser, putUser, deleteUser } = require('./users.query.js');

// GET all users
router.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query(getUsers);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Aucun utilisateur.' });
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
  }
});

// GET one user
router.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { rows } = await pool.query(getUser, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur.' });
  }
});

// PATCH user password
router.patch('/users/:userId/password', async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Les deux champs sont requis.' });
  }

  try {
    const { rows } = await pool.query(getUser, [userId]);
    const user = rows[0];
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) return res.status(403).json({ error: 'Mot de passe actuel incorrect.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

    res.json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.patch('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const allowedFields = ['name', 'email', 'password'];
  const updates = {};

  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Aucun champ valide à mettre à jour.' });
  }

  try {
    const setClause = Object.keys(updates)
      .map((key, idx) => `${key} = $${idx + 1}`)
      .join(', ');

    const values = [...Object.values(updates), userId];
    const sql = `UPDATE users SET ${setClause} WHERE id = $${values.length}`;

    const result = await pool.query(sql, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({
      message: 'Utilisateur mis à jour avec succès !',
      updatedFields: updates,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur.' });
  }
});


// PUT user (update name/email)
router.put('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Le prénom et l\'email sont requis.' });
  }

  try {
    const result = await pool.query(putUser, [name, email, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({
      message: 'Utilisateur mis à jour avec succès !',
      userId,
      name,
      email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur.' });
  }
});

// DELETE user
router.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(deleteUser, [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({
      message: 'Utilisateur supprimé avec succès !',
      userId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur.' });
  }
});

module.exports = router;
