const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const log = require('../helper/log');
// const userModel = require('../models/user');
const config = process.env;

const verifyToken = (req, res, next) => {

  try {
    const token = req.headers['authorization'];
    log.info(`[Middleware],token [${token}]`);
    if (!token) {
      res.status(401).json({ msg: "Unauthorized Access" });
      return;
    }

    const decoded = jwt.verify(token.slice(7), "token");
    log.info(`[Middleware],Decoded token:: [${JSON.stringify(decoded)}]`);
    if (decoded) {
      const payload = decoded;
      const tokenLength = Object.keys(payload).length;
      log.info(`[Middleware],token-length [${tokenLength}]`);
      if (tokenLength != 4) {
        log.info(`[Middleware],token Length is not  5]`);
        return res
          .status(400)
          .json({
            msg: "Unauthorized Access.",
          });
      }
      return next();
    } else {
      log.info(`[Middleware],token not decoded]`);
      return res.status(400).json({ msg: "Unauthorized Access.", });
    }
  } catch (err) {
    log.info(`[Middleware],token not decoded] Error [${err}]`);
    return res.status(401).json({ msg: "Invalid Token" });
  }

};

module.exports = verifyToken;
