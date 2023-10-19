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
  checkUserEmail: function (email) {
    return new Promise((resolve, reject) => {
      let data = [email];
      let query = "select * from users where email =? and status=2";
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
  checkUserMobile: function (mobile) {
    return new Promise((resolve, reject) => {
      let data = [mobile];
      let query = "select * from users where phone =?";
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            log.info(
              "[USER], [MODEL], [checkUserMobile], [error], [" + err + "]"
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
          log.info(
            "[USER], [MODEL], [checkUserMobile], [error], [" + err + "]"
          );
          return reject(err);
        }
      });
    });
  },

  getTotalUsers: function () {
    return new Promise((resolve, reject) => {
      let query =
        "select count(*) as total from users where date(created_at)=curdate() and type='5'";
      pool.query(query, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(results[0]);
          }
        } catch (err) {
          log.info(`[USER], [MODEL], [getTotalUsers], [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },

  getActiveUsers: function () {
    return new Promise((resolve, reject) => {
      let query = "select id, name from users where status = 3 ";
      pool.query(query, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(results);
          }
        } catch (err) {
          log.info(`[USER], [MODEL], [getActiveUsers], [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },

  getActiveClientUsers: function (type, status) {
    return new Promise((resolve, reject) => {
      let query =
        "select id, name from users where status = ? and type = ?";
      const data = [status, type];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(results);
          }
        } catch (err) {
          log.info(
            `[USER], [MODEL], [getActiveClientUsers], [error], [${err}]`
          );
          return reject(err);
        }
      });
    });
  },

  getAllUsers: function () {
    return new Promise((resolve, reject) => {
      let query = "select * from users order by id desc";
      pool.query(query, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(results);
          }
        } catch (err) {
          log.info(`[USER], [MODEL], [getAllUsers], [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },

  getAdminUsers: function (superAdminType, clienType) {
    return new Promise((resolve, reject) => {
      let query =
        "select * from users where type != ? and type != ? order by id desc";
      const data = [superAdminType, clienType];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(results);
          }
        } catch (err) {
          log.info(`[USER], [MODEL], [getAllUsers], [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },

  getClientUsers: function (clientType, searchType, value, startDate, endDate) {
    return new Promise((resolve, reject) => {
      let query = "";
      let data = [];
      if (value && searchType == "NAME") {
        query =
          "select u.id, u.name, u.email as userEmail, u.phone, u.status, u.created_at, u.address, u.city, u.state_name, u.country, a.sms, a.voice, a.email from users as u INNER JOIN account_credits as a on a.user_id = u.id where type = ? and u.name like ?   order by u.id desc";

        data = [clientType, `%${value}%`];
      } else if (value && searchType == "EMAIL") {
        query =
          "select u.id, u.name, u.email as userEmail, u.phone, u.status, u.created_at, u.address, u.city, u.state_name, u.country, a.sms, a.voice, a.email from users as u INNER JOIN account_credits as a on a.user_id = u.id where type = ? and u.email like ?   order by u.id desc";

        data = [clientType, `%${value}%`];
      } else if (value && searchType == "PHONE NO.") {
        query =
          "select u.id, u.name, u.email as userEmail, u.phone, u.status, u.created_at, u.address, u.city, u.state_name, u.country, a.sms, a.voice, a.email from users as u INNER JOIN account_credits as a on a.user_id = u.id where type = ? and u.phone like ?  order by u.id desc";

        data = [clientType, `%${value}%`];
      } else {
        query =
          "select u.id, u.name, u.email as userEmail, u.phone, u.status, u.created_at, u.address, u.city, u.state_name, u.country, a.sms, a.voice, a.email from users as u INNER JOIN account_credits as a on a.user_id = u.id where type = ?  and date(u.created_at) BETWEEN ? and ? order by u.id desc";
        data = [clientType, startDate, endDate];
      }

      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(results);
          }
        } catch (err) {
          log.info(`[USER], [MODEL], [getClientUsers], [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },
  updateClientStatus: function (targetUserId, status) {
    return new Promise((resolve, reject) => {
      const query = "update users set status = ? where id =? ";
      const data = [status, targetUserId];

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
    newMid,
    name,
    email,
    mobile,
    password,
    userType,
    permissions
  ) {
    return new Promise((resolve, reject) => {
      let query =
        "Insert into users (m_id, name, email, phone, password, state, status, type, mode, created_at, updated_at, permissions) values(?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now(), ?)";
      let data = [
        newMid,
        name,
        email,
        mobile,
        password,
        1,
        1,
        userType,
        1,
        permissions,
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

  updateUser: function (email, name, userType, permissions) {
    return new Promise((resolve, reject) => {
      let query =
        "Update users set name = ?, type = ?, permissions = ? where email = ?";

      let data = [name, userType, permissions, email];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(true);
          }
        } catch (err) {
          log.info(`[USER], [MODEL], [updateUser], [error], [${err}]`);
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
  getTotalCustomerUsers: function (status, type) {
    return new Promise((resolve, reject) => {
      let query =
        "select id, name from users where status = ? and  type=?";
      let data = [status, type];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(results);
          }
        } catch (err) {
          log.info(`[USER], [MODEL], [getActiveUsers], [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },
  getAdmin: function (type) {
    return new Promise((resolve, reject) => {
      let query =
        "select * from users where  type= 1 OR type=2 order by id desc";

      const data = [type];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            if (results.length > 0) return resolve(results);
            else resolve(false);
          }
        } catch (err) {
          log.info("[USER], [MODEL], [getAdmin], [error], [" + err + "]");
          return reject(err);
        }
      });
    });
  },
  UserExistsByEmail: function (email) {
    return new Promise((resolve, reject) => {
      let query = "select * from users where email=?";
      let data = [email];

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

  createPasswordDB: function (email, hashPassword) {
    return new Promise((resolve, reject) => {
      let query = "Update users set password = ? where email = ?";
      let data = [hashPassword, email];

      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            log.info(
              "[USER], [MODEL], [createPassword], [error], [" + err + "]"
            );
            throw err;
          } else {
            return resolve(true);
          }
        } catch (err) {
          log.info("[USER], [MODEL], [createPassword], [error], [" + err + "]");
          return reject(err);
        }
      });
    });
  },

  otpCheck: function (mobile) {
    return new Promise((resolve, reject) => {
      let data = [mobile];
      let query = "select * from otps where phone=?";
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
  otp: function (otp, number) {
    return new Promise((resolve, reject) => {
      let query = "Update otps set otp = ? where number = ?";
      let data = [otp, number];
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

  // updateUserDetail: function (
  //   name,
  //   mode,
  //   socialId,
  //   mobile,
  //   hashPassword,
  //   userId
  // ) {
  //   return new Promise((resolve, reject) => {
  //     let query =
  //       "Update users set name = ?, mode = ?, social_id = ?, phone = ?, password=? where id = ?";
  //     let data = [name, mode, socialId, mobile, hashPassword, userId];
  //     pool.query(query, data, (err, results, fields) => {
  //       try {
  //         if (err) {
  //           log.info("[USER], [MODEL], [isUserExist], [error], [" + err + "]");
  //           throw err;
  //         } else {
  //           resolve(true);
  //         }
  //       } catch (err) {
  //         log.info("[USER], [MODEL], [isUserExist], [error], [" + err + "]");
  //         return reject(err);
  //       }
  //     });
  //   });
  // },
  createUser: function (m_id, name, email, mobile, identityToken) {
    const cName = "LoginController"; //controller's name
    const fName = "otpVerify"; // function's name
    return new Promise((resolve, reject) => {
      let query =
        "Insert into users (m_id, name, email, phone, state, status, type, mode, created_at, updated_at, permissions, identity_token) values(?, ?, ?, ?, ?, ?, ?, ?, now(), now(), ?,?)";
      let data = [
        m_id,
        name,
        email,
        mobile,
        1,
        1,
        5,
        2,
        process.env.PERMISSIONS,
        identityToken,
      ];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(results.insertId);
          }
        } catch (err) {
          log.info(`[cName], [fName], [MODEL], [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },
  addOtp: function (mobile, otp) {
    const cName = "LoginController"; //controller's name
    const fName = "otpVerify"; // function's name
    return new Promise((resolve, reject) => {
      let query =
        "Insert into otps (phone, otp,created_at,updated_at) values(?, ?,now(), now())";
      let data = [mobile, otp];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(results.insertId);
          }
        } catch (err) {
          log.info(`[cName], [fName], [MODEL] [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },
  getOtp: function (mobile) {
    const cName = "LoginController"; //controller's name
    const fName = "otpVerify"; // function's name
    return new Promise((resolve, reject) => {
      let data = [mobile];
      let query = "select * from otps where phone=? order by id desc limit 1";
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            log.info("[cName], [fName], [MODEL], [error], [" + err + "]");
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
          log.info("[cName], [fName], [MODEL], [error], [" + err + "]");
          return reject(err);
        }
      });
    });
  },
  getUserByMobile: function (mobile) {
    const cName = "LoginController"; //controller's name
    const fName = "getUserByMobile"; // function's name

    return new Promise((resolve, reject) => {
      let data = [mobile];
      let query = "select * from users where phone=? order by id desc limit 1";
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            log.info("[cName], [fName], [MODEL], [error], [" + err + "]");
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
          log.info("[cName], [fName], [MODEL],  [error], [" + err + "]");
          return reject(err);
        }
      });
    });
  },
  updateStatus: function (status, email) {
    const cName = "LoginController"; //controller's name
    const fName = "updateState"; // function's name
    return new Promise((resolve, reject) => {
      let query = "Update users set status = ?  where  email= ? ";
      let data = [status, email];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            log.info("[cName], [fName],  [MODEL], [error], [" + err + "]");
            throw err;
          } else {
            var numRows = results.length;
            if (numRows > 0) {
              log.info("[cName], [fName],  [MODEL], [error], [" + query + "]");
              return resolve(results[0]);
            } else {
              return resolve(false);
            }
          }
        } catch (err) {
          log.info(
            "[cName], [fName], [MODEL], [isUserExist], [error], [" + err + "]"
          );
          return reject(err);
        }
      });
    });
  },
  // updateStatus: function (status, email) {
  //   const cName = "LoginController"; //controller's name
  //   const fName = "updateStatus"; // function's name

  //   return new Promise((resolve, reject) => {
  //     let query = "Update users set status = ?  where  email= ? ";
  //     let data = [state, status, email];
  //     pool.query(query, data, (err, results, fields) => {
  //       try {
  //         if (err) {
  //           log.info("[cName], [fName],  [MODEL], [error], [" + err + "]");
  //           throw err;
  //         } else {
  //           var numRows = results.length;
  //           if (numRows > 0) {
  //             return resolve(results[0]);
  //           } else {
  //             return resolve(false);
  //           }
  //         }
  //       } catch (err) {
  //         log.info(
  //           "[cName], [fName], [MODEL], [isUserExist], [error], [" + err + "]"
  //         );
  //         return reject(err);
  //       }
  //     });
  //   });
  // },
  accountcredits: function (user_id, credits) {
    const cName = "LoginController"; //controller's name
    const fName = "updateUserStatus"; // function's name

    return new Promise((resolve, reject) => {
      let query =
        "Insert into account_credits (user_id,sms, created_at, updated_at) values(?, ?,  now(), now())";
      let data = [user_id, credits];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(results.insertId);
          }
        } catch (err) {
          log.info(
            "[cName], [fName], [MODEL], [accountcreditsinsert], [error], [" +
            err +
            "]"
          );
          return reject(err);
        }
      });
    });
  },
  checkUserByEmail: function (loginId) {
    const cName = "LoginController"; //controller's name
    const fName = "checkUserByEmail"; // function's name

    return new Promise((resolve, reject) => {
      let query =
        "select * from users where email=? and status!=2 and state!=2";
      let data = [loginId];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            log.info(
              "[LoginController], [MODEL], [checkUserByEmail], [error], [" +
              err +
              "]"
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
          log.info(
            "[LoginController], [MODEL], [checkUserByEmail], [error], [" +
            err +
            "]"
          );
          return reject(err);
        }
      });
    });
  },
  checkUserStatusByEmail: function (status, state, loginId) {
    // const cName = "LoginController"; //controller's name
    // const fName = "checkUserByEmail"; // function's name
    return new Promise((resolve, reject) => {
      let query = "select * from users where email=? AND status =? ";
      let data = [status, state, loginId];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            log.info(
              "[LoginController], [MODEL], [checkUserByEmail], [error], [" +
              err +
              "]"
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
          log.info(
            "[LoginController], [MODEL], [checkUserByEmail], [error], [" +
            err +
            "]"
          );
          return reject(err);
        }
      });
    });
  },
  checkUserBySocialId: function (loginId) {
    const cName = "LoginController"; //controller's name
    const fName = "checkUserByEmail"; // function's name

    return new Promise((resolve, reject) => {
      let query = "select * from users where social_id=?";
      let data = [loginId];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            log.info(
              "[LoginController], [MODEL], [checkUserByEmail], [error], [" +
              err +
              "]"
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
          log.info(
            "[LoginController], [MODEL], [checkUserByEmail], [error], [" +
            err +
            "]"
          );
          return reject(err);
        }
      });
    });
  },
  checkUserStatusBySocialId: function (status, state, loginId) {
    // const cName = "LoginController"; //controller's name
    // const fName = "checkUserByEmail"; // function's name
    return new Promise((resolve, reject) => {
      let query = "select * from users where social_id=? AND status =? ";
      let data = [status, state, loginId];
      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            log.info(
              "[LoginController], [MODEL], [checkUserByEmail], [error], [" +
              err +
              "]"
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
          log.info(
            "[LoginController], [MODEL], [checkUserByEmail], [error], [" +
            err +
            "]"
          );
          return reject(err);
        }
      });
    });
  },

  changeUserPassword: function (newhashPassword, userId) {
    return new Promise((resolve, reject) => {
      const query = "update users set password = ? where id =? ";
      const data = [newhashPassword, userId];

      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(true);
          }
        } catch (err) {
          log.info(`[USER], [MODEL], [changeUserPassword], [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },

  updateUserDetail: function (name, mode, mobile, userId) {
    return new Promise((resolve, reject) => {
      const query = "update users set name = ?, mode=?, phone=? where id =? ";
      const data = [name, mode, mobile, userId];

      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(true);
          }
        } catch (err) {
          log.info(`[USER], [MODEL], [changeUserPassword], [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },

  updateUserProfile: function (
    fullName,
    address,
    city,
    state,
    country,
    userId
  ) {
    return new Promise((resolve, reject) => {
      const query =
        "update users set name = ?,address=?, city=?, state_name=?, country=? where id =? ";
      const data = [fullName, address, city, state, country, userId];

      pool.query(query, data, (err, results, fields) => {
        try {
          if (err) {
            throw err;
          } else {
            return resolve(true);
          }
        } catch (err) {
          log.info(`[USER], [MODEL], [changeUserPassword], [error], [${err}]`);
          return reject(err);
        }
      });
    });
  },
};
