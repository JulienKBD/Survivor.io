const express = require('express');
const pool = require('../../config/db.js');
const router = express.Router();
const { getUsers, getUser, putUser, deleteUser } = require('./users.query.js');

// GET all users
router.get('/users', async (req, res) => {
  try {
    console.log("test");
    const result = await pool.query(getUsers);
    console.log("connexion réussie");

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aucun utilisateur.' });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
  }
});

// GET user by ID
router.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(getUser, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur.' });
  }
});

// UPDATE user
router.put('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Le prénom, l\'email et le mot de passe sont requis.' });
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
      email,
      password
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
