const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 500,
  user: process.env.DB2_USER,
  password: process.env.DB2_PASS,
  host: process.env.DB2_HOST,
  database: process.env.DB2_NAME,
});

module.exports = pool;
