const contactGroup = require("../models/contactGroup");
const contact = require("../models/contact");
const reportModel = require("../models/reports");
const campaignModel = require("../models/campaign");
const userModel = require("../models/user");
const accountCreditsModel = require("../models/accountCredits");
const invoiceModel = require("../models/invoices");
const campaignReportModel = require("../models/campaignReport");
const senderIdModel = require("../models/senderId");
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
const mv = promisify(fs.rename);
var pdf = require("pdf-creator-node");
const common = require("../helper/common");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const opts = {
  errorEventName: "error",
  logDirectory: "logs",
  fileNamePattern: "log-<DATE>.log",
  dateFormat: "YYYY-MM-DD",
};
const log = require("simple-node-logger").createRollingFileLogger(opts);

async function getUsers(req, res) {
  try {
    var userId = req.headers["id"];

    log.info(`[USER], [getUsers], User Id [${userId}]`);

    const list = await userModel.getAdminUsers(
      process.env.SUPER_ADMIN_USER,
      process.env.CLIENT_USER
    );

    if (!list) {
      log.info(`[USER], [getUsers], [No User Found]`);
      return res.status(400).json({ msg: "No User Found" });
    }

    log.info(`[USER], [getUsers], [User List has been sent successfully]`);
    return res.status(200).json(list);
  } catch (e) {
    log.info(`[USER], [getUsers], Error [${e}]`);
    res.status(500).json(e);
  }
}

async function getClientUsers(req, res) {
  try {
    var userId = req.headers["id"];
    const type = req.body.type;
    const value = req.body.value;
    let { searchType, searchValue, endDate, startDate } = req.body;

    log.info(
      `[USER], [getClientUsers], User Id [${userId}], Type [${type}], Value [${value}, StartDate [${startDate}], EndDate[${endDate}], SearchTYpe [${searchType}], SsearchValue [${searchValue}]]`
    );

    const list = await userModel.getClientUsers(
      process.env.CLIENT_USER,
      type,
      value,
      startDate,
      endDate,
    );

    if (!list) {
      log.info(`[USER], [getClientUsers], [No User Found]`);
      return res.status(400).json({ msg: "No User Found" });
    }

    log.info(
      `[USER], [getClientUsers], [User List has been sent successfully]`
    );

    // log.info(
    //   `[USER], [getClientUsers], [${JSON.stringify(list)}]]`
    // );
    return res.status(200).json(list);
  } catch (e) {
    log.info(`[USER], [getClientUsers], Error [${e}]`);
    res.status(500).json(e);
  }
}
async function updateClientStatus(req, res) {
  try {
    var userId = req.headers["id"];
    const targetUserId = req.body?.id;
    const status = req.body?.status;

    log.info(
      `[USER], [updateClientStatus], User Id [${userId}], Target UserId [${targetUserId}], Status [${status}]`
    );

    if (!targetUserId || !status) {
      log.info(`[USER], [updateClientStatus], [Missing Parameters]`);
      return res.status(400).json({ msg: "Missing Parameters" });
    }

    await userModel.updateClientStatus(targetUserId, status);

    log.info(
      `[USER], [updateClientStatus], [User's Status Updated Successfully]`
    );
    return res.status(200).json({ msg: "Client Status Updated Successfully" });
  } catch (e) {
    log.info(`[USER], [updateClientStatus], Error [${e}]`);
    res.status(500).json(e);
  }
}

async function addUser(req, res) {
  try {
    var userId = req.headers["id"];

    let { name, email, mobile, userType, permissions } = req.body;

    log.info(
      `[USER], [addUser], User Id [${userId}], Name [${name}], Email [${email}], Mobile [${mobile}], User Type [${userType}], Permissions [${permissions}]`
    );

    if (!name || !email || !mobile || !userType || !permissions) {
      log.info(`[USER], [addUser], [Missing Parameter]`);
      return res.status(400).json({ msg: "Missing Parameter" });
    }

    let isExists = await userModel.checkUserEmail(email);
    if (isExists) {
      log.info(`[USER], [addUser], [Email address already exists]`);
      return res.status(400).json({ msg: "Email address already exists" });
    }

    mobile = mobile.toString();
    mobile = "260" + mobile.slice(mobile.length - 9, mobile.length);

    isExists = await userModel.checkUserMobile(mobile);
    if (isExists) {
      log.info(`[USER], [addUser], [Phone Number already exists]`);
      return res.status(400).json({ msg: "Phone Number already exists" });
    }

    // let newMid = await userModel.getLastMid();
    // if (!newMid) newMid = 1000112;
    // else newMid = newMid.m_id++;

    const password = common.generatePassword();

    log.info(`[USER], [addUser], Password [${password}]`);

    //   bcrypt.hash(password).then(function(hash) {
    //   // Store hash in your password DB.
    // });

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.addUserDB(
      101,
      name,
      email,
      mobile,
      hashedPassword,
      userType,
      permissions
    );
    try {
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        // auth: {
        //   user: process.env.EMAIL_USER,
        //   pass: process.env.EMAIL_PASS,
        // },
      });
      let info = await transporter.sendMail({
        from: process.env.EMAIL_SENDER, // sender address
        to: email, // list of receivers
        subject: "Account Successfully Created", // Subject line
        text: `Hi ${name},\n\nYour account has been successfully created on the TxtConnect. Please find your system generated credentials below. Kindly change the password after login. \n\nUrl : https://txtconnect.watchmyproduct.com/login \n\nLogin Id : ${email} \n\nPassword : ${password} \n\n  Thanks,\nTeam TxtConnect \nhttps://txtconnect.watchmyproduct.com`, // plain text body
        html: `<p>Hi ${name},<BR><BR>Your account has been successfully created on the TxtConnect. Please find your system generated credentials below. Kindly change the password after login. 
 <BR><BR>Url : <a href="https://txtconnect.watchmyproduct.com/login">https://txtconnect.watchmyproduct.com/login</a> <BR>Login Id : <b>${email}</b> <BR>Password : <b>${password}</b></p><BR><p>Thanks, <BR>Team TxtConnect<BR><a href="https://txtconnect.watchmyproduct.com">https://txtconnect.watchmyproduct.com</a></p>`, // html body
      });

      log.info(
        `[USER], [addUser], [User has been created successfully], Mail response [${JSON.stringify(
          info
        )}]`
      );
    } catch (mailErr) {
      log.info(
        `[Campaign Email], [sendMail], Mail Error [${JSON.stringify(mailErr)}]`
      );
    }
    return res.status(200).json({ msg: "User has been created successfully" });
  } catch (e) {
    log.info(`[USER], [addUser], Error [${e}]`);
    res.status(500).json(e);
  }
}

async function editUser(req, res) {
  try {
    var userId = req.headers["id"];

    let { name, email, userType, permissions } = req.body;

    log.info(
      `[USER], [editUser], User Id [${userId}], Name [${name}], Email [${email}] User Type [${userType}], Permissions [${permissions}]`
    );

    if (!name || !userType || !permissions) {
      log.info(`[USER], [editUser], [Missing Parameter]`);
      return res.status(400).json({ msg: "Missing Parameter" });
    }

    await userModel.updateUser(email, name, userType, permissions);

    log.info(`[USER], [editUser], [User has been updated successfully`);
    return res.status(200).json({ msg: "User has been updated successfully" });
  } catch (e) {
    log.info(`[USER], [editUser], Error [${e}]`);
    res.status(500).json(e);
  }
}

async function addCredits(req, res) {
  try {
    var userId = req.headers["id"];

    let { id, name, sms, voice, email } = req.body;

    log.info(
      `[USER], [addCredits], User Id [${userId}], Selected User Id [${id}], Name [${name}], SMS Credits [${sms}], Voice Credits [${voice}], Email Credits [${email}]`
    );

    if (
      !id ||
      sms == undefined ||
      sms == null
    ) {
      log.info(`[USER], [addCredits], [Missing Parameter]`);
      return res.status(400).json({ msg: "Missing Parameter" });
    }

    await accountCreditsModel.addCredits(id, sms, voice, email);

    log.info(
      `[USER], [addCredits], [User's Credits has been updated successfully`
    );
    return res
      .status(200)
      .json({ msg: "User's Credits has been updated successfully" });
  } catch (e) {
    log.info(`[USER], [addCredits], Error [${e}]`);
    res.status(500).json(e);
  }
}

var self = (module.exports = {
  getUsers,
  addUser,
  editUser,
  addCredits,
  getClientUsers,
  updateClientStatus,
});
