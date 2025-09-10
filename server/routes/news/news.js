const express = require('express');
const pool = require('../../config/db.js');
const router = express.Router();
const {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews
} = require('./news.query.js');

// CREATE News
router.post('/news', async (req, res) => {
  const { news_date, location, title, category, description, startup_id } = req.body;

  if (!news_date || !title || !category) {
    return res.status(400).json({ msg: 'Bad parameter' });
  }

  try {
    const result = await pool.query(createNews, [
      news_date,
      location || null,
      title,
      category,
      description || null,
      startup_id || null
    ]);

    const newsId = result.rows[0].id;
    const { rows } = await pool.query(getNewsById, [newsId]);

    return res.status(201).json({ news: rows[0] });
  } catch (err) {
    console.error('Error creating news:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

// READ all News
router.get('/news', async (req, res) => {
  try {
    const { rows } = await pool.query(getAllNews);
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching news:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

// READ one News by id
router.get('/news/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(getNewsById, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ msg: 'News not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching news:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

// UPDATE News
router.put('/news/:id', async (req, res) => {
  const { news_date, location, title, category, description, startup_id } = req.body;

  try {
    const result = await pool.query(updateNews, [
      news_date,
      location || null,
      title,
      category,
      description || null,
      startup_id || null,
      req.params.id
    ]);

    if (result.rowCount === 0) return res.status(404).json({ msg: 'News not found' });
    return res.json({ msg: 'News updated successfully' });
  } catch (err) {
    console.error('Error updating news:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

// DELETE News
router.delete('/news/:id', async (req, res) => {
  try {
    const result = await pool.query(deleteNews, [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ msg: 'News not found' });
    return res.json({ msg: 'News deleted successfully' });
  } catch (err) {
    console.error('Error deleting news:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
