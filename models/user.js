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
  isUserExist: function (userId) {
    return new Promise((resolve, reject) => {
      let data = [userId];
      let query = "select * from users where id=?";
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            log.info("[USER], [MODEL], [isUserExist], [error], [" + err + "]");
            throw err;
          } else {
            var numRows = results.length;
            if (numRows > 0) {
              return resolve(results[0]);
            } else {
              return resolve(false);
            }
          }
        } catch (err) {
          log.info("[USER], [MODEL], [isUserExist], [error], [" + err + "]");
          return reject(err);
        }
      });
    });
  },
  checkUserbyMobile: function (mobile) {
    return new Promise((resolve, reject) => {
      let data = [mobile];
      let query = "select * from users where contact_number =?";
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            log.info(
              "[USER], [MODEL], [checkUserMObile], [error], [" + err + "]"
            );
            throw err;
          } else {
            var numRows = results.length;
            if (numRows > 0) {
              return resolve(results[0]);
            } else {
              return resolve(false);
            }
          }
        } catch (err) {
          log.info("[USER], [MODEL], [checkUserMObile], [error], [" + err + "]");
          return reject(err);
        }
      });
    });
  },

  checkUserbyEmail: function (email) {
    return new Promise((resolve, reject) => {
      let data = [email];
      let query = "select * from users where email =?";
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            log.info(
              "[USER], [MODEL], [checkUserEmail], [error], [" + err + "]"
            );
            throw err;
          } else {
            var numRows = results.length;
            if (numRows > 0) {
              return resolve(results[0]);
            } else {
              return resolve(false);
            }
          }
        } catch (err) {
          log.info("[USER], [MODEL], [checkUserEmail], [error], [" + err + "]");
          return reject(err);
        }
      });
    });
  },




  // getClientUsers: function (clientType, searchType, value, startDate, endDate) {
  //   return new Promise((resolve, reject) => {
  //     let query = "";
  //     let data = [];
  //     if (value && searchType == "NAME") {
  //       query =
  //         "select u.id, u.name, u.email as userEmail, u.phone, u.status, u.created_at, u.address, u.city, u.state_name, u.country, a.sms, a.voice, a.email from users as u INNER JOIN account_credits as a on a.user_id = u.id where type = ? and u.name like ?   order by u.id desc";

  //       data = [clientType, `%${value}%`];
  //     } else if (value && searchType == "EMAIL") {
  //       query =
  //         "select u.id, u.name, u.email as userEmail, u.phone, u.status, u.created_at, u.address, u.city, u.state_name, u.country, a.sms, a.voice, a.email from users as u INNER JOIN account_credits as a on a.user_id = u.id where type = ? and u.email like ?   order by u.id desc";

  //       data = [clientType, `%${value}%`];
  //     } else if (value && searchType == "PHONE NO.") {
  //       query =
  //         "select u.id, u.name, u.email as userEmail, u.phone, u.status, u.created_at, u.address, u.city, u.state_name, u.country, a.sms, a.voice, a.email from users as u INNER JOIN account_credits as a on a.user_id = u.id where type = ? and u.phone like ?  order by u.id desc";

  //       data = [clientType, `%${value}%`];
  //     } else {
  //       query =
  //         "select u.id, u.name, u.email as userEmail, u.phone, u.status, u.created_at, u.address, u.city, u.state_name, u.country, a.sms, a.voice, a.email from users as u INNER JOIN account_credits as a on a.user_id = u.id where type = ?  and date(u.created_at) BETWEEN ? and ? order by u.id desc";
  //       data = [clientType, startDate, endDate];
  //     }

  //     pool.query(query, data, (err, results, fields) => {
  //       try {
  //         if (err) {
  //           throw err;
  //         } else {
  //           return resolve(results);
  //         }
  //       } catch (err) {
  //         log.info(`[USER], [MODEL], [getClientUsers], [error], [${err}]`);
  //         return reject(err);
  //       }
  //     });
  //   });
  // },
  updateClientStatus: function (status, mobile) {
    return new Promise((resolve, reject) => {
      const query = "update users set status = ? where contact_number= ?";
      const data = [status, mobile];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(true);
          }
        } catch (err) {
          log.info(`[USER], [MODEL], [updateClientStatus], [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },

  addUserDB: function (
    name,
    email,
    mobile,
    password,
    userType
  ) {
    return new Promise((resolve, reject) => {
      let query =
        "Insert into users ( name, email, contact_number, password,  role, status,  created_at, updated_at) values(?, ?, ?, ?, ?, ?,  now(), now())";
      let data = [
        name,
        email,
        mobile,
        password,
        userType,
        1,
      ];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(results.insertId);
          }
        } catch (err) {
          log.info(`[USER], [MODEL], [addUserDB], [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },
  getLastMid: function () {
    return new Promise((resolve, reject) => {
      let query = "select m_id from users order by id desc limit 1";
      pool.query(query, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            if (results.length > 0) return resolve(results[0]);
            else resolve(false);
          }
        } catch (err) {
          log.info(`[USER], [MODEL], [getLastMid], [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },
};
