const createUser = `
  INSERT INTO users (email, password, name, role)
  VALUES ($1, $2, $3, $4)
  RETURNING id, email, name, role
`;

const getUserByEmail = `
  SELECT * FROM users WHERE email = $1
`;

module.exports = {
  createUser,
  getUserByEmail
};
