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

  let conn;
  try {
    conn = await pool.getConnection();

    const result = await conn.query(createNews, [
      news_date,
      location || null,
      title,
      category,
      description || null,
      startup_id || null
    ]);

    const insertedId = result.insertId;
    const [news] = await conn.query(getNewsById, [insertedId]);

    return res.status(201).json({ news });
  } catch (err) {
    console.error('Error creating news:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ msg: 'News already exists' });
    }
    return res.status(500).json({ msg: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// READ all News
router.get('/news', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const newsList = await conn.query(getAllNews);
    return res.status(200).json(newsList);
  } catch (err) {
    console.error('Error fetching news:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// READ one News by id
router.get('/news/:id', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [news] = await conn.query(getNewsById, [req.params.id]);

    if (!news) return res.status(404).json({ msg: 'News not found' });
    return res.json(news);
  } catch (err) {
    console.error('Error fetching news:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// UPDATE News
router.put('/news/:id', async (req, res) => {
  const { news_date, location, title, category, description, startup_id } = req.body;

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(updateNews, [
      news_date,
      location || null,
      title,
      category,
      description || null,
      startup_id || null,
      req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'News not found' });
    }
    return res.json({ msg: 'News updated successfully' });
  } catch (err) {
    console.error('Error updating news:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// DELETE News
router.delete('/news/:id', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(deleteNews, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'News not found' });
    }

    return res.json({ msg: 'News deleted successfully' });
  } catch (err) {
    console.error('Error deleting news:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
