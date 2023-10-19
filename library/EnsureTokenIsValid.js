var request = require('request');

const config = process.env;


function ensureValidity(req) {

  try {
    const token = req.headder['authorization'];
    if (!token) {
      return res.status(400).json("msg: Unauthorized Access");
    }
  } catch (err) {
    return err;
  }
};

module.exports = { generateMessageId };

