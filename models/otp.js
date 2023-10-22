var sql = require("mysql");
var pool = require("../db");

const opts = {
  errorEventName: "error",
  logDirectory: "logs",
  fileNamePattern: "log-<DATE>.log",
  dateFormat: "YYYY-MM-DD",
};
const log = require("simple-node-logger").createRollingFileLogger(opts);

module.exports = {


  addOtp: function (
    mobile,
    otp
  ) {
    return new Promise((resolve, reject) => {
      let query =
        "Insert into otps ( phone, otp, created_at, updated_at) values(?, ?, now(), now())";
      let data = [
        mobile,
        otp,
      ];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(results.insertId);
          }
        } catch (err) {
          log.info(`[OTP], [MODEL], [addOtp], [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },

  getotp(mobile, otp) {
    return new Promise((resolve, reject) => {
      let query = "select * from otps order by id desc limit 1";
      pool.query(query, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            if (results.length > 0) return resolve(results[0]);
            else resolve(false);
          }
        } catch (err) {
          log.info(`[OTP], [MODEL], [getotp], [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },
};
