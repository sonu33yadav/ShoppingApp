const contactGroup = require("../models/contactGroup");
const contact = require("../models/contact");
const campaign = require("../models/campaign");
const senderIdModel = require("../models/senderId");
const callerIdModel = require("../models/callerId");
const accountCreditsModel = require("../models/accountCredits");
const smsTemplateModel = require("../models/smsTemplate");
const campaignReport = require("../models/campaignReport");
const reports = require("../models/reports");
const reqLib = require("../library/request");
const messageIdGen = require("../library/messageIdGenerate");
const http = require("http");
const https = require("https");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const readXlsxFile = require("read-excel-file/node");
const excelJS = require("exceljs");
const fsPromises = require("fs").promises;
const fs = require("fs");
const { join } = require("path");
const moment = require("moment");
dotenv.config();
const config = process.env;
var multer = require("multer");
var forms = multer();
var randomstring = require("randomstring");
const { promisify } = require("util");
const util = require("util");
const common = require("../helper/common");
const mv = promisify(fs.rename);
const formidable = require("formidable");

const opts = {
  errorEventName: "error",
  logDirectory: "logs",
  fileNamePattern: "log-<DATE>.log",
  dateFormat: "YYYY-MM-DD",
};
const log = require("simple-node-logger").createRollingFileLogger(opts);

async function runcampaign(req, res) {
  try {
    let message = null;
    var storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, "./users/upload/voice/");
      },
      filename: function (req, file, callback) {
        var originalname = file.originalname;
        var splitName = originalname.split(".");

        var fileType = splitName[splitName.length - 1];
        var fileName =
          randomstring.generate() + file.fieldname + "." + fileType;
        log.info(`Filename: ${fileName}`);
        message = `${config.FILEPATH_URL}/upload/voice/${fileName}`;
        callback(null, fileName);
      },
    });
    var upload = multer({ storage: storage });
    const nupload = util.promisify(upload.any());
    await nupload(req, res);
    let userId = req.headers["id"];
    let { name, type, groupId, isScheduled, scheduledAt, callerId } = req.body;

    log.info(
      `[campaign], [runcampaign], User Id [${userId}], Name [${name}], Type [${type}], Group Id [${groupId}], Calller Id [${callerId}], Is Scheduled [${isScheduled}]`
    );

    if (!name || !type || !groupId || !callerId) {
      log.info(`[campaign], [runcampaign], [Missing parameters]`);
      return res.status(400).json({ msg: "Missing parameters" });
    }

    const isExists = await campaign.isCampaignNameExistsByUserId(name, userId);

    if (isExists) {
      log.info(`[campaign], [runcampaign], [Campaign Name is already exists]`);
      return res.status(400).json({ msg: "Campaign Name is already exists" });
    }

    let groupContacts = await contact.getContactList(groupId);
    let contactLength = groupContacts?.length;
    let balanceConsumed = groupContacts?.length;

    //checking account balance
    const accountBal = await accountCreditsModel.checkAccountBal(userId);
    const isSufficientBal = common.checkingBalance(
      "campaign",
      "runcampaign",
      accountBal,
      balanceConsumed,
      type
    );

    if (!isSufficientBal) {
      return res
        .status(400)
        .json({ msg: "Insufficient balance to run this campaign" });
    }

    log.info(`type of isScheduled is ${typeof isScheduled}`);

    if (!isScheduled || isScheduled == "false") {
      isScheduled = 2;
    } else {
      isScheduled = 1;
      if (!scheduledAt) {
        log.info(`[campaign], [runcampaign], [Missing parameters scheduledAt]`);
        return res.status(400).json({ msg: "Missing parameters" });
      }
    }

    if (contactLength > 0) {
      const callerIdDetails = await callerIdModel.getCallerIdById(callerId);
      if (false == callerIdDetails) {
        log.info(
          `[campaign], [runcampaign], Group Id [${groupId}], Caller Id not found`
        );
        return res.status(200).json({ msg: "No caller Id found" });
      }
      if (2 == isScheduled) {
        const campaignId = await campaign.addCampaign(
          userId,
          groupId,
          name,
          message,
          type,
          callerId,
          contactLength,
          balanceConsumed
        );

        await accountCreditsModel.deductBalance(
          userId,
          accountBal?.voice - balanceConsumed,
          "voice"
        );
        log.info(
          `[campaign], [runcampaign], [Campaign started], Campaign Id [${campaignId}], Balance Consumed [${balanceConsumed}], Campaign Type [VOICE], Group Id [${groupId}]`
        );

        await processCampaignPush(
          groupId,
          callerId,
          campaignId,
          name,
          type,
          message,
          userId
        );

        const NewAccountBal = await accountCreditsModel.checkAccountBal(userId);

        return res.status(200).json({
          msg: "Campaign has been started",
          userCredit: NewAccountBal,
        });
      } else {
        const campaignId = await campaign.addScheduledCampaign(
          userId,
          groupId,
          name,
          message,
          type,
          callerId,
          scheduledAt,
          isScheduled,
          contactLength,
          balanceConsumed
        );
        log.info(
          `[campaign], [runcampaign], [Campaign Scheduled], Campaign Id [${campaignId}], Group Id [${groupId}], Scheduled At [${scheduledAt}]`
        );

        if (process.env.SMS == type) {
          await accountCreditsModel.deductBalance(
            userId,
            accountBal?.sms - balanceConsumed,
            "sms"
          );
          log.info(
            `[campaign], [runcampaign], [Campaign Scheduled], Campaign Id [${campaignId}], Balance Consumed [${balanceConsumed}], Campaign Type [SMS], Group Id [${groupId}]`
          );
        } else if (process.env.VOICE == type) {
          await accountCreditsModel.deductBalance(
            userId,
            accountBal?.voice - balanceConsumed,
            "voice"
          );
          log.info(
            `[campaign], [runcampaign], [Campaign Scheduled], Campaign Id [${campaignId}], Balance Consumed [${balanceConsumed}], Campaign Type [VOICE], Group Id [${groupId}]`
          );
        } else {
          await accountCreditsModel.deductBalance(
            userId,
            accountBal?.email - balanceConsumed,
            "email"
          );
          log.info(
            `[campaign], [runcampaign], [Campaign Scheduled], Campaign Id [${campaignId}], Balance Consumed [${balanceConsumed}], Campaign Type [EMAIL], Group Id [${groupId}]`
          );
        }
        return res
          .status(200)
          .json({ msg: "Campaign has been scheduled", isScheduled });
      }
    } else {
      log.info(
        `[campaign], [runcampaign], Group Id [${groupId}], No contacts found in the group`
      );
      return res.status(200).json({ msg: "Please add contacts to the group." });
    }
  } catch (e) {
    log.info(`[campaign], [runcampaign], Error [${e}]`);
    return res.status(500).json(e);
  }
}

async function processCampaignPush(
  groupId,
  callerId,
  campaignId,
  name,
  type,
  message,
  userId
) {
  return new Promise(async (resolve, reject) => {
    const groupContacts = await contact.getContactList(groupId);
    const callerIdDetails = await callerIdModel.getCallerIdById(callerId);

    //await campaign.setTotalSent(campaignId, groupContacts.length);
    log.info(
      `[campaign], [processCampaignPush], Campaign Id [${campaignId}], Campaign Name [${name}], Campaign Started`
    );
    const path = `./users/upload/campaign/${campaignId}`;
    let folderAction = await fs.promises.mkdir(path, { recursive: true });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Contacts");
    worksheet.columns = [
      { header: "First Name", key: "firstName", width: 20 },
      { header: "Last Name", key: "lastName", width: 15 },
      { header: "Email", key: "email", width: 20 },
      { header: "Mobile", key: "mobile", width: 20 },
      { header: "Caller Id", key: "callerId", width: 20 },
      { header: "Campaign Name", key: "campaignName", width: 40 },
      { header: "Status", key: "status", width: 20 },
      { header: "Message", key: "message", width: 160 },
    ];
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    var xlsxFileName = `${campaignId}.xlsx`;
    groupContacts.map((contact) => {
      let mobile = contact["mobile"];
      mobile = mobile.toString();
      mobile = "260" + mobile.slice(mobile.length - 9, mobile.length);

      log.info(
        `[campaign], [processCampaignPush], Campaign Name [${name}], Caller ID [${callerIdDetails["callerid"]}], Campaign Id [${campaignId}], Group Id [${groupId}],  Mobile [${mobile}], First Name [${contact["first_name"]}], Last Name [${contact["last_name"]}], Type [VOICE], Message [${message}]`
      );
    });
    await campaign.setCampaignStatus(campaignId, 2);
    log.info(
      `[campaign], [processCampaignPush], Campaign Id [${campaignId}], Campaign Name [${name}], Campaign Ended`
    );
    await workbook.xlsx.writeFile(`${path}/` + xlsxFileName);
    var fileUrl = `${config.FILEPATH_URL}/upload/campaign/${campaignId}/${xlsxFileName}`;
    await campaign.updateCampaignReport(fileUrl, campaignId);
    return resolve(true);
  });
}

async function getCallerIdContactGroups(req, res) {
  try {
    var userId = req.headers["id"];

    log.info(`[campaign], [getCallerIdContactGroups], User Id [${userId}]`);

    const callerIds = await callerIdModel.getApprovedCallerIds(userId);
    const contactGroups = await contactGroup.getUserCompletedGroupList(userId);

    log.info(
      `[campaign], [getCallerIdContactGroups], [Caller Ids & Contact Group List has been sent successfully]`
    );
    res.status(200).json({ callerIds, contactGroups });
  } catch (e) {
    log.info(`[campaign], [getCallerIdContactGroups], Error [${e}]`);
    res.status(500).json(e);
  }
}

var self = (module.exports = {
  runcampaign,
  processCampaignPush,
});
