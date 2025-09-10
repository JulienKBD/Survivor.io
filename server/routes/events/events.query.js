// INSERT
const createEvent = `
  INSERT INTO events (name, dates, location, description, event_type, target_audience)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING id
`;

const getAllEvents = `
  SELECT * FROM events
`;

const getEventById = `
  SELECT * FROM events WHERE id = $1
`;

const updateEvent = `
  UPDATE events
  SET name = $1, dates = $2, location = $3, description = $4, event_type = $5, target_audience = $6
  WHERE id = $7
`;

const deleteEvent = `
  DELETE FROM events WHERE id = $1
`;

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
};
