const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// logger1 ()
const log = require("../helper/log");
var customerControler = require("../controller/customer");
var senderIdControler = require("../controller/smsSenderId");
var planControler = require("../controller/plan");

// router.get("/dashboard", (req, res) => {
//   log.info("On Route [Customer Dashboard]");
//   try {
//     customerControler.userDashboard(req, res);
//   } catch (error) {
//     log.info("On Route [Get Customer Dashboard], [" + error + "]");
//     res.status(404).json({ msg: "Invalid Request" });
//   }
// });

router.get("/dashboard", (req, res) => {
  log.info("On Route [Customer Dashboard]");
  try {
    var controler = require("../controller/dashboard");
    controler.userDashboard(req, res);
  } catch (error) {
    log.info("On Route [Get Customer Dashboard], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/add-contacts", auth, (req, res) => {
  log.info("On Route [add-contacts]");
  try {
    var controler = require("../controller/contact");
    controler.addContactBulk(req, res);
  } catch (error) {
    log.info("On Route [add-contacts], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.get("/getSenderIdContactGroups/:param", (req, res) => {
  log.info("On Route [getSenderIdContactGroups]");
  try {
    var controler = require("../controller/campaign");
    controler.getSenderIdContactGroups(req, res);
  } catch (error) {
    log.info("On Route [getSenderIdContactGroups], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/signUp", (req, res) => {
  log.info("On Route [signUp]");
  try {
    customerControler.signUp(req, res);
  } catch (error) {
    log.info("On Route [signUp], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/otpVerify", (req, res) => {
  log.info("On Route [verify-otp]");
  try {
    customerControler.otpVerify(req, res);
  } catch (error) {
    log.info("On Route [otpVerify], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/createPassword", (req, res) => {
  log.info("On Route [createPassword]");
  try {
    customerControler.createPassword(req, res);
  } catch (error) {
    log.info("On Route [createPassword], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/login", (req, res) => {
  log.info("On Route [verify-otp]");
  try {
    customerControler.login(req, res);
  } catch (error) {
    log.info("On Route [customer], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/changePassword", (req, res) => {
  log.info("On Route [changePasswordin this ]");
  try {
    customerControler.changePassword(req, res);
  } catch (error) {
    log.info("On Route [customer], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.post("/forgetPassword", (req, res) => {
  log.info("On Route [forgetPassword]");
  try {
    customerControler.forgotPassword(req, res);
  } catch (error) {
    log.info("On Route [customer], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.post("/updateProfile", (req, res) => {
  log.info("On Route [update-profile]");
  try {
    customerControler.updateProfile(req, res);
  } catch (error) {
    log.info("On Route [customer], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/resendOtp", (req, res) => {
  log.info("On Route [resend-otp]");
  try {
    customerControler.resendOtp(req, res);
  } catch (error) {
    log.info("On Route [customer], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.post("/requestSenderId", (req, res) => {
  log.info("On Route [request-senderId]");
  try {
    senderIdControler.requestSmsSenderId(req, res);
  } catch (error) {
    log.info("On Route [smsSenderId], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.post("/deleteSenderId", (req, res) => {
  log.info("On Route [delete-smsSenderId]");
  try {
    senderIdControler.deletesmsSenderId(req, res);
  } catch (error) {
    log.info("On Route [delete-smsSenderId], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/allSenderIds", (req, res) => {
  log.info("On Route [all-userSenderids]");
  try {
    senderIdControler.alluserSenderIds(req, res);
  } catch (error) {
    log.info("On Route [all-userSenderids], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/editSenderId", (req, res) => {
  log.info("On Route [edit-smsSenderids]");
  try {
    senderIdControler.editSmsSenderIds(req, res);
  } catch (error) {
    log.info("On Route [edit-smsSenderids], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/users-List", (req, res) => {
  log.info("On Route [users-smsSenderids]");
  try {
    senderIdControler.userlist(req, res);
  } catch (error) {
    log.info("On Route [users-smsSenderids], [" + error + "]");
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
//PLans
router.get("/getPlans", (req, res) => {
  log.info("On Route [getPlans]");
  try {
    planControler.getPlans(req, res);
  } catch (error) {
    log.info("On Route [getPlans], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/getContactGroups", (req, res) => {
  log.info("On Route [getContactGroups]");
  try {
    var controler = require("../controller/contact");
    controler.getContactGroups(req, res);
  } catch (error) {
    log.info("On Route [getContactGroups], [" + error + "]");
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

router.post("/runQuickMessage", (req, res) => {
  log.info("On Route [Run], [runQuickMessage]");
  try {
    var controler = require("../controller/quickMessage");
    controler.runQuickMessage(req, res);
  } catch (error) {
    log.info("On Route [Run], [runQuickMessage], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.post("/runApiMessage", (req, res) => {
  log.info("On Route [Run], [runApiMessage]");
  try {
    var controler = require("../controller/apiMessage");
    controler.runApiMessage(req, res);
  } catch (error) {
    log.info("On Route [Run], [runQuickMessage], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/getQuickMessages", (req, res) => {
  log.info("On Route [Run], [POST], [getQuickMessages]");
  try {
    var controler = require("../controller/quickMessage");
    controler.getQuickMessages(req, res);
  } catch (error) {
    log.info("On Route [Run], [POST], [getQuickMessages], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/runQuickMessageForExcel", (req, res) => {
  log.info("On Route [Run], [runQuickMessageForExcel]");
  try {
    var controler = require("../controller/quickMessage");
    controler.runQuickMessageForExcel(req, res);
  } catch (error) {
    log.info("On Route [Run], [runQuickMessageForExcel], [" + error + "]");
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

router.post("/getQuickReports", (req, res) => {
  log.info("On Route [getQuickReports]");
  try {
    var controler = require("../controller/quickGenerateReports");
    controler.getQuickReports(req, res);
  } catch (error) {
    log.info("On Route [getQuickReports], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/generateQuickReport", (req, res) => {
  log.info("On Route [getQuickReports]");
  try {
    var controler = require("../controller/quickGenerateReports");
    controler.generateQuickReport(req, res);
  } catch (error) {
    log.info("On Route [generateQuickReport], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

// Reports

router.post("/getReports", (req, res) => {
  log.info("On Route [getReports]");
  try {
    var controler = require("../controller/reports");
    controler.getReports(req, res);
  } catch (error) {
    log.info("On Route [getReports], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/runcampaign", (req, res) => {
  log.info("On Route [Run], [Campaign]");
  try {
    var controler = require("../controller/campaign");
    controler.runcampaign(req, res);
  } catch (error) {
    log.info("On Route [Run], [Campaign], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.get("/getSenderIdContactGroups/:param", (req, res) => {
  log.info("On Route [getSenderIdContactGroups]");
  try {
    var controler = require("../controller/campaign");
    controler.getSenderIdContactGroups(req, res);
  } catch (error) {
    log.info("On Route [getSenderIdContactGroups], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.post("/addSmsTemplate", (req, res) => {
  log.info("On Route [addSmsTemplate]");
  try {
    var controler = require("../controller/smsTemplate");
    controler.addSmsTemplate(req, res);
  } catch (error) {
    log.info("On Route [addSmsTemplate], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.post("/getSmsTemplates", (req, res) => {
  log.info("On Route [getSmsTemplates]");
  try {
    var controler = require("../controller/smsTemplate");
    controler.getSmsTemplates(req, res);
  } catch (error) {
    log.info("On Route [getSmsTemplates], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.get("/getContactList/:id", (req, res) => {
  log.info("On Route [getContactList]");
  try {
    var controler = require("../controller/contact");
    controler.getContactList(req, res);
  } catch (error) {
    log.info("On Route [getContactList], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/editGroupName", (req, res) => {
  log.info("On Route, [POST], [editGroupName]");
  try {
    var controler = require("../controller/contact");
    controler.editGroupName(req, res);
  } catch (error) {
    log.info("On Route [editGroupName], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/addSingleContact", (req, res) => {
  log.info("On Route [addSingleContact]");
  try {
    var controler = require("../controller/contact");
    controler.addSingleContact(req, res);
  } catch (error) {
    log.info("On Route [addSingleContact], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/deleteMultipleContact", (req, res) => {
  log.info("On Route, [POST], [deleteMultipleContact]");
  try {
    var controler = require("../controller/contact");
    controler.deleteMultipleContact(req, res);
  } catch (error) {
    log.info("On Route [deleteMultipleContact], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/deleteSingleContact", (req, res) => {
  log.info("On Route [deleteSingleContact]");
  try {
    var controler = require("../controller/contact");
    controler.deleteSingleContact(req, res);
  } catch (error) {
    log.info("On Route [deleteSingleContact], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/editSingleContact", (req, res) => {
  log.info("On Route [editSingleContact]");
  try {
    var controler = require("../controller/contact");
    controler.editSingleContact(req, res);
  } catch (error) {
    log.info("On Route [editSingleContact], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.post("/runCustomCampaign", (req, res) => {
  log.info("On Route [Run], [runCustomCampaign]");
  try {
    var controler = require("../controller/customCampaign");
    controler.runcampaign(req, res);
  } catch (error) {
    log.info("On Route [Run], [runCustomCampaign], [" + error + "]");
    res.status(400).json({ msg: "Invalid Request" });
  }
});

router.post("/getDateRangeCampaign", (req, res) => {
  log.info("On Route [Run], [getDateRangeCampaign]");
  try {
    var controler = require("../controller/campaign");
    controler.getDateRangeCampaign(req, res);
  } catch (error) {
    log.info("On Route [Run], [getDateRangeCampaign], [" + error + "]");
    res.status(400).json({ msg: "Invalid Request" });
  }
});

router.get("/GetSmsReports/:type/:value", (req, res) => {
  log.info("On Route [GetSmsReports]");
  try {
    var controler = require("../controller/reports");
    controler.GetReportsBySearch(req, res);
  } catch (error) {
    log.info("On Route [GetSmsReports], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
router.post("/editSmsTemplate", (req, res) => {
  log.info("On Route [editSmsTemplate]");
  try {
    var controler = require("../controller/smsTemplate");
    controler.editSmsTemplate(req, res);
  } catch (error) {
    log.info("On Route [editSmsTemplate], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/merge-contacts", (req, res) => {
  log.info("On Route [merge-contacts]");
  try {
    var controler = require("../controller/contact");
    controler.mergeContactBulk(req, res);
  } catch (error) {
    log.info("On Route [merge-contacts], [" + error + "]");
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

router.post("/generateQuickReport", (req, res) => {
  log.info("On Route [getQuickReports]");
  try {
    var controler = require("../controller/quickGenerateReports");
    controler.generateQuickReport(req, res);
  } catch (error) {
    log.info("On Route [generateQuickReport], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
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

router.post("/removeContactGroup", (req, res) => {
  log.info("On Route, [POST], [removeContactGroup]");
  try {
    var controler = require("../controller/contact");
    controler.removeContactGroup(req, res);
  } catch (error) {
    log.info("On Route [removeContactGroup], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/generateReport", (req, res) => {
  log.info("On Route [generateReport]");
  try {
    var controler = require("../controller/reports");
    controler.generateReport(req, res);
  } catch (error) {
    log.info("On Route [generateReport], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
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

router.get("/getApiKeys", (req, res) => {
  log.info("On Route [getApiKeys]");
  try {
    var controler = require("../controller/apiKey");
    controler.getApiKeys(req, res);
  } catch (error) {
    log.info("On Route [getApiKeys], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/regenerateApiKey", (req, res) => {
  log.info("On Route [regenerateApiKey]");
  try {
    var controler = require("../controller/apiKey");
    controler.regenerateApiKey(req, res);
  } catch (error) {
    log.info("On Route [regenerateApiKey], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
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

router.post("/billing", (req, res) => {
  log.info("On Route [Run], [billing]");
  try {
    var controler = require("../controller/billing");
    controler.billing(req, res);
  } catch (error) {
    log.info("On Route [Run], [billing], [" + error + "]");
    res.status(400).json({ msg: "Invalid Request" });
  }
});
router.post("/validateotp", (req, res) => {
  log.info("On Route [validateOTP]");
  try {
    var controler = require("../controller/payment");
    controler.validateOTP(req, res);
  } catch (error) {
    log.info(`On Route [validateOTP], [${error}]`);
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/getOtp", (req, res) => {
  log.info("On Route [getOtp]");
  try {
    var controler = require("../controller/payment");
    controler.getOtp(req, res);
  } catch (error) {
    log.info(`On Route [getOtp], [${error}]`);
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/makePayment", async (req, res) => {
  log.info("On Route [Run], [makePayment]");
  try {
    var controler = require("../controller/makePayment");
    await controler.makePayment(req, res);
  } catch (error) {
    log.error("On Route [Run], [makePayment], [" + error + "]");
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/getStatus/:RefrenceId", async (req, res) => {
  log.info("On Route [Run], [makePayment]");
  try {
    var controler = require("../controller/makePayment");
    await controler.getStatus(req, res);
  } catch (error) {
    log.error("On Route [Run], [makePayment], [" + error + "]");
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/addPayment", (req, res) => {
  log.info("On Route [addPayment]");
  try {
    var controler = require("../controller/payment");
    controler.addPayment(req, res);
  } catch (error) {
    log.info(`On Route [addPayment], [${error}]`);
    res.status(404).json({ msg: "Invalid Request" });
  }
});

router.post("/updateStatus", (req, res) => {
  log.info("On Route [updateStatus]");
  try {
    var controler = require("../controller/payment");
    controler.updatePayment(req, res);
  } catch (error) {
    log.info(`On Route [updateStatus], [${error}]`);
    res.status(404).json({ msg: "Invalid Request" });
  }
});
module.exports = router;
