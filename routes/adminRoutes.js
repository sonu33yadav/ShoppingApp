const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
// logger1 ()
const log = require("../helper/log");
const senderIdControler = require("../controller/smsSenderId");
const dashboardController = require("../controller/dashboard");

router.get("/dashboard", (req, res) => {
  log.info("On Route [Admin Dashboard]");
  try {
    var controler = require("../controller/dashboard");
    controler.adminDashboard(req, res);
  } catch (error) {
    log.info("On Route [adminDashboard], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/allSenderId", (req, res) => {
  log.info("On Route [get-allSmssenderId]");
  try {
    senderIdControler.adminGetAllSmsSenderIds(req, res);
  } catch (error) {
    log.info("On Route [smsSenderId], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.get("/allSenderIdRequests", (req, res) => {
  log.info("On Route [admin-allSmssenderIdRequests]");
  try {
    senderIdControler.adminSMSSenderIdRequests(req, res);
  } catch (error) {
    log.info("On Route [smsSenderId], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/SenderIdAction", (req, res) => {
  log.info("On Route [smsSenderId-action]");
  try {
    senderIdControler.adminSenderIdAction(req, res);
  } catch (error) {
    log.info("On Route [smsSenderId], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.post("/addSenderId", (req, res) => {
  log.info("On Route [admin-addSenderId]");
  try {
    senderIdControler.adminAddSmsSenderid(req, res);
  } catch (error) {
    log.info("On Route [admin-addSenderId], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.post("/viewReports", (req, res) => {
  log.info("On Route, [GET], [viewReports]");
  try {
    var controler = require("../controller/reports");
    controler.viewReports(req, res);
  } catch (error) {
    log.info("On Route [viewReports], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.get("/getCampaigns/:param", (req, res) => {
  log.info("On Route, [GET], [getCampaigns]");
  try {
    var controler = require("../controller/campaign");
    controler.getCampaigns(req, res);
  } catch (error) {
    log.info("On Route [getCampaigns], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/getCampaigns/:param", (req, res) => {
  log.info("On Route, [POST], [getCampaigns]");
  try {
    var controler = require("../controller/campaign");
    controler.getCampaigns(req, res);
  } catch (error) {
    log.info("On Route [getCampaigns], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.get("/getQuickMessages", (req, res) => {
  log.info("On Route [Run], [getQuickMessages]");
  try {
    var controler = require("../controller/quickMessage");
    controler.getQuickMessages(req, res);
  } catch (error) {
    log.info("On Route [Run], [getQuickMessages], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

// router.post("/getQuickMessages", (req, res) => {
//   log.info("On Route [Run], [POST], [getQuickMessages]");
//   try {
//     var controler = require("../controller/quickMessage");
//     controler.getQuickMessages(req, res);
//   } catch (error) {
//     log.info("On Route [Run], [POST], [getQuickMessages], [" + error + "]");
//     res.status(404).json({ msg: "Invalid Request" });
//   }
// });

router.post("payment/list", (req, res) => {
  log.info("On Route [Payment List]");
  try {
    var controler = require("../controller/payment");
    controler.getPaymentList4Admin(req, res);
  } catch (error) {
    log.info(`On Route [Payment List], [${error}]`);
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/searchSenderids", (req, res) => {
  log.info("On Route [search-Senderids]");
  try {
    senderIdControler.searchSenderIds(req, res);
  } catch (error) {
    log.info("On Route [search-Senderids], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.post("/payment/list", (req, res) => {
  log.info("On Route [Payment List]");
  try {
    var controler = require("../controller/payment");
    controler.getPaymentList4Admin(req, res);
  } catch (error) {
    log.info(`On Route [Payment List], [${error}]`);
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.get("/getInvoices", (req, res) => {
  log.info("On Route [getInvoices]");
  try {
    var controler = require("../controller/invoices");
    controler.getInvoices(req, res);
  } catch (error) {
    log.info("On Route [getInvoices], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.get("/getUsers", (req, res) => {
  log.info("On Route [getUsers]");
  try {
    var controler = require("../controller/user");
    controler.getUsers(req, res);
  } catch (error) {
    log.info("On Route [getUsers], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/getClientUsers", (req, res) => {
  log.info("On Route [getClientUsers]");
  try {
    var controler = require("../controller/user");
    controler.getClientUsers(req, res);
  } catch (error) {
    log.info("On Route [getClientUsers], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/updateClientStatus", (req, res) => {
  log.info("On Route [updateClientStatus]");
  try {
    var controler = require("../controller/user");
    controler.updateClientStatus(req, res);
  } catch (error) {
    log.info("On Route [updateClientStatus], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/addCredits", (req, res) => {
  log.info("On Route [addCredits]");
  try {
    var controler = require("../controller/user");
    controler.addCredits(req, res);
  } catch (error) {
    log.info("On Route [addCredits], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});


router.post("payment/list", (req, res) => {
  log.info("On Route [Payment List]");
  try {
    var controler = require("../controller/payment");
    controler.getPaymentList4Admin(req, res);
  } catch (error) {
    log.info(`On Route [Payment List], [${error}]`);
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.get("/getQuickMessages", (req, res) => {
  log.info("On Route [Run], [getQuickMessages]");
  try {
    var controler = require("../controller/quickMessage");
    controler.getQuickMessages(req, res);
  } catch (error) {
    log.info("On Route [Run], [getQuickMessages], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});



router.post("/addUser", (req, res) => {
  log.info("On Route [addUser]");
  try {
    var controler = require("../controller/user");
    controler.addUser(req, res);
  } catch (error) {
    log.info("On Route [addUser], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});


router.post("/editUser", (req, res) => {
  log.info("On Route [editUser]");
  try {
    var controler = require("../controller/user");
    controler.editUser(req, res);
  } catch (error) {
    log.info("On Route [editUser], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/getCampaigns/:param", (req, res) => {
  log.info("On Route, [GET], [getCampaigns]");
  try {
    var controler = require("../controller/campaign");
    controler.getCampaigns(req, res);
  } catch (error) {
    log.info("On Route [getCampaigns], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});



router.post("/generateReports", (req, res) => {
  log.info("On Route [generateReports]");
  try {
    var controler = require("../controller/reports");
    controler.generateReports(req, res);
  } catch (error) {
    log.info("On Route [generateReports], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.get("GetSmsReports/:type/:value", (req, res) => {
  log.info("On Route [GetSmsReports]");
  try {
    var controler = require("../controller/reports");
    controler.GetReportsBySearch(req, res);
  } catch (error) {
    log.info("On Route [GetSmsReports], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.get("/getCampaignReports/:id", (req, res) => {
  log.info("On Route [Run], [getCampaignReports]");
  try {
    var controler = require("../controller/campaignReport");
    controler.getCampaignReports(req, res);
  } catch (error) {
    log.info("On Route [Run], [getCampaignReports], [" + error + "]");
    res.status(400).json({ msg: "Invalid Request" });
  }
});


router.post("/getQuickMessages", (req, res) => {
  log.info("On Route [Run], [getQuickMessages]");
  try {
    var controler = require("../controller/quickMessage");
    controler.getQuickMessages(req, res);
  } catch (error) {
    log.info("On Route [Run], [getQuickMessages], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.get("/getQuickMessageReports/:id", (req, res) => {
  log.info("On Route [Run], [getQuickMessageReports]");
  try {
    var controler = require("../controller/quickMessageReport");
    controler.getQuickMessageReports(req, res);
  } catch (error) {
    log.info("On Route [Run], [getQuickMessageReports], [" + error + "]");
    res.status(400).json({ msg: "Invalid Request" });
  }
});

router.post("/deleteScheduledCampaign", (req, res) => {
  log.info("On Route [Run], [deleteScheduledCampaign]");
  try {
    var controler = require("../controller/campaign");
    controler.deleteScheduledCampaign(req, res);
  } catch (error) {
    log.info("On Route [Run], [deleteScheduledCampaign], [" + error + "]");
    res.status(400).json({ msg: "Invalid Request" });
  }
});


router.post("/getConnections", (req, res) => {
  log.info("On Route [CONNECTIONS], [getConnections]");
  try {
    var controler = require("../controller/connection");
    controler.getConnections(req, res);
  } catch (error) {
    log.info("On Route [CONNECTIONS], [getConnections], [" + error + "]");
    res.status(400).json({ msg: "Invalid Request" });
  }
});


router.post("/addConnection", (req, res) => {
  log.info("On Route [CONNECTIONS], [addConnection]");
  try {
    var controler = require("../controller/connection");
    controler.addConnection(req, res);
  } catch (error) {
    log.info("On Route [CONNECTIONS], [addConnection], [" + error + "]");
    res.status(400).json({ msg: "Invalid Request" });
  }
});

router.post("/statusUpdate", (req, res) => {
  log.info("On Route [CONNECTIONS], [statusUpdate]");
  try {
    var controler = require("../controller/connection");
    controler.statusUpdate(req, res);
  } catch (error) {
    log.info("On Route [CONNECTIONS], [statusUpdate], [" + error + "]");
    res.status(400).json({ msg: "Invalid Request" });
  }
});

router.get("/generateCampaignReport/:id", (req, res) => {
  log.info("On Route [getQuickReports]");
  try {
    var controler = require("../controller/quickGenerateReports");
    controler.generateCampaignReport(req, res);
  } catch (error) {
    log.info("On Route [generateQuickReport], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});


module.exports = router;
