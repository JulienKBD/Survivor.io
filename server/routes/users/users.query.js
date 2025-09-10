const getUsers = `
    SELECT *
    FROM users;
`;

const getUser = `
    SELECT *
    FROM users
    WHERE id = $1;
`;

const putUser = `
    UPDATE users
    SET name = $1, email = $2, password = $3
    WHERE id = $4;
`;

const deleteUser = `
    DELETE FROM users
    WHERE id = $1;
`;

module.exports = {
    getUsers,
    getUser,
    putUser,
    deleteUser
};
