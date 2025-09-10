const express = require('express');
const pool = require('../../config/db.js');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require('./events.query.js');

// CREATE Event
router.post('/events', async (req, res) => {
  const { name, dates, location, description, event_type, targent_audience } = req.body;

  if (!name || !dates || !description || !event_type || !targent_audience) {
    return res.status(400).json({ msg: 'Bad parameter' });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const result = await conn.query(createEvent, [
      name,
      dates,
      location,
      description,
      event_type,
      targent_audience
    ]);

    const insertedId = result.insertId;
    const [event] = await conn.query(getEventById, [insertedId]);

    return res.status(201).json({ event });
  } catch (err) {
    console.error('Error creating event:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ msg: 'Event already exists' });
    }
    return res.status(500).json({ msg: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// READ all Events
router.get('/events', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const events = await conn.query(getAllEvents);
    return res.status(201).json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// READ one Event by id
router.get('/events/:id', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [event] = await conn.query(getEventById, [req.params.id]);

    if (!event) return res.status(404).json({ msg: 'Event not found' });
    return res.json(event);
  } catch (err) {
    console.error('Error fetching event:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// UPDATE Event
router.put('/events/:id', async (req, res) => {
  const { name, dates, location, description, event_type, targent_audience } = req.body;

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(updateEvent, [
      name,
      dates,
      location,
      description,
      event_type,
      targent_audience,
      req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    return res.json({ msg: 'Event updated successfully' });
  } catch (err) {
    console.error('Error updating event:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// DELETE Event
router.delete('/events/:id', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(deleteEvent, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    return res.json({ msg: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
