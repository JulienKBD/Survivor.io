// news.query.js

const createNews = `
  INSERT INTO news (news_date, location, title, category, description, startup_id)
  VALUES (?, ?, ?, ?, ?, ?)
`;

const getAllNews = `
  SELECT * FROM news
`;

const getNewsById = `
  SELECT * FROM news WHERE id = ?
`;

const updateNews = `
  UPDATE news
  SET news_date = ?, location = ?, title = ?, category = ?, description = ?, startup_id = ?
  WHERE id = ?
`;

const deleteNews = `
  DELETE FROM news WHERE id = ?
`;

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews
};
