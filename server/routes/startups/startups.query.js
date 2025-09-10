// INSERT
const createStartup = `
INSERT INTO startups
(name, legal_status, address, email, phone, description, website_url, social_media_url, project_status, needs, sector, maturity, image, founder_id)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const getStartupByEmail = `
  SELECT * FROM startups WHERE email = ?
`;

const getAllStartups = `
  SELECT *
  FROM startups
`;

const getStartupById = `
  SELECT *
  FROM startups
  WHERE id = ?
`;

const updateStartup = `
  UPDATE startups
  SET name = ?, legal_status = ?, address = ?, email = ?, phone = ?,
  description = ?, website_url = ?, social_media_url = ?, project_status = ?,
  needs = ?, sector = ?, maturity = ?, image = ?, views = ?
  WHERE id = ?
`;

const deleteStartup = `
  DELETE FROM startups WHERE id = ?
`;

module.exports = {
  createStartup,
  getStartupByEmail,
  getAllStartups,
  getStartupById,
  updateStartup,
  deleteStartup
};
