const getUsers = `
    SELECT *
    FROM users;
`;

const getUser = `
    SELECT *
    FROM users
    WHERE id = ?;
`;

const putUser = `
    UPDATE users
    SET name = ?, email = ?, password = ?
    WHERE id = ?;
`;

const deleteUser = `
    DELETE FROM users
    WHERE id = ?
`;

module.exports = {
    getUsers,
    getUser,
    putUser,
    deleteUser
};
