const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
// logger1 ()
const log = require("../helper/log");
router.get("/", (req, res) => {
  log.info("On Route [Admin Dashboard]");
  try {
    log.info("On Route [Admin Dashboard]");
  } catch (error) {
    log.info("On Route [adminDashboard], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});



module.exports = router;
