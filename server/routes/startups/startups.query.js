// INSERT
const createStartup = `
INSERT INTO startups
(name, legal_status, address, email, phone, description, website_url, social_media_url, project_status, needs, sector, maturity, image, founder_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
RETURNING *;
`;

const getStartupByEmail = `
SELECT * FROM startups WHERE email = $1
`;

const getAllStartups = `
SELECT * FROM startups
`;

const getStartupById = `
SELECT * FROM startups
WHERE id = $1
`;

const updateStartup = `
UPDATE startups
SET name = $1, legal_status = $2, address = $3, email = $4, phone = $5,
description = $6, website_url = $7, social_media_url = $8, project_status = $9,
needs = $10, sector = $11, maturity = $12, image = $13, views = $14
WHERE id = $15
RETURNING *;
`;

const deleteStartup = `
DELETE FROM startups WHERE id = $1
RETURNING *;
`;

module.exports = {
  createStartup,
  getStartupByEmail,
  getAllStartups,
  getStartupById,
  updateStartup,
  deleteStartup
};
