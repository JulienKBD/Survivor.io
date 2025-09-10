const mariadb = require('mariadb');
require('dotenv').config()

const pool = mariadb.createPool({
    host: process.env.MARIADB_HOST,
    port: process.env.MARIADB_PORT,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_ROOT_PASSWORD,
    database: process.env.MARIADB_DATABASE,
    connectionLimit: process.env.MARIADB_CONNECTION_LIMIT
});

console.log("Connection pool created.");

module.exports = pool;
