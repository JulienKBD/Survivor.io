const createUser = `
    INSERT INTO users
    (email, password, name, role)
    VALUES (?, ?, ?, ?);
`;

const getUserByEmail = `
    SELECT *
    FROM users
    WHERE email = ?;
`;

module.exports = {
    createUser,
    getUserByEmail
};
