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
  const { name, dates, location, description, event_type, target_audience } = req.body;

  if (!name || !dates || !description || !event_type || !target_audience) {
    return res.status(400).json({ msg: 'Bad parameter' });
  }

  try {
    const result = await pool.query(createEvent, [
      name,
      dates,
      location || null,
      description,
      event_type,
      target_audience
    ]);

    const eventId = result.rows[0].id;
    const { rows } = await pool.query(getEventById, [eventId]);

    return res.status(201).json({ event: rows[0] });
  } catch (err) {
    console.error('Error creating event:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

// READ all Events
router.get('/events', async (req, res) => {
  try {
    const { rows } = await pool.query(getAllEvents);
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

// READ one Event by id
router.get('/events/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(getEventById, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ msg: 'Event not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching event:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

// UPDATE Event
router.put('/events/:id', async (req, res) => {
  const { name, dates, location, description, event_type, target_audience } = req.body;

  try {
    const result = await pool.query(updateEvent, [
      name,
      dates,
      location || null,
      description,
      event_type,
      target_audience,
      req.params.id
    ]);

    if (result.rowCount === 0) return res.status(404).json({ msg: 'Event not found' });
    return res.json({ msg: 'Event updated successfully' });
  } catch (err) {
    console.error('Error updating event:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

// DELETE Event
router.delete('/events/:id', async (req, res) => {
  try {
    const result = await pool.query(deleteEvent, [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ msg: 'Event not found' });
    return res.json({ msg: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
