const createEvent = `
  INSERT INTO events
  (name, dates, location, description, event_type, targent_audience)
  VALUES (?, ?, ?, ?, ?, ?)
`;

const getAllEvents = `SELECT * FROM events`;

const getEventById = `SELECT * FROM events WHERE id = ?`;

const updateEvent = `
  UPDATE events
  SET name = ?, dates = ?, location = ?, description = ?, event_type = ?,
  targent_audience = ?
  WHERE id = ?
`;

const deleteEvent = `DELETE FROM events WHERE id = ?`;

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
};
