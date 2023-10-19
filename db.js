const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 500,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
});

module.exports = pool;
