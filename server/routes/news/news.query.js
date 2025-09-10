// INSERT
const createNews = `
  INSERT INTO news (news_date, location, title, category, description, startup_id)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING id
`;

const getAllNews = `
  SELECT * FROM news
`;

const getNewsById = `
  SELECT * FROM news WHERE id = $1
`;

const updateNews = `
  UPDATE news
  SET news_date = $1, location = $2, title = $3, category = $4, description = $5, startup_id = $6
  WHERE id = $7
`;

const deleteNews = `
  DELETE FROM news WHERE id = $1
`;

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews
};
