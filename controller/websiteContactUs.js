const contactGroup = require("../models/contactGroup");
const contact = require("../models/contact");
const reportModel = require("../models/reports");
const campaignModel = require("../models/campaign");
const userModel = require("../models/user");
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
const { getMaxListeners } = require("process");

const opts = {
  errorEventName: "error",
  logDirectory: "logs",
  fileNamePattern: "log-<DATE>.log",
  dateFormat: "YYYY-MM-DD",
};
const log = require("simple-node-logger").createRollingFileLogger(opts);

async function sendMail(req, res) {
  try {
    // var userId = req.headers["id"];

    let { email, message, name, subject } = req.body;

    log.info(
      `[WebsiteContactUS], [sendMail],  Message [${message}], Email [${email}], Name [${name}], Subject [${subject}]`
    );

    if (!name || !email || !message || !subject) {
      log.info(`[WebsiteContactUS], [sendMail], [Missing Parameter]`);
      return res.status(400).json({ msg: "Missing Parameter" });
    }
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
      //info@txtconnect.co
      let info = await transporter.sendMail({
        from: process.env.EMAIL_SENDER, // sender address
        to: "info@txtconnect.c", // list of receivers
        subject: "Query From WebSite", // Subject line
        html: ` <b>Name:</b>&nbsp;${name}<br><b>Email:</b>&nbsp;${email}<br><b>Subject:</b>&nbsp;${subject}<br><b>Message:</b>&nbsp;${message}.<br><br><p>Thanks, <BR>Team TxtConnect<BR><a href="https://txtconnect.watchmyproduct.com">https://txtconnect.watchmyproduct.com</a></p> `, // plain text body ,
      });

      log.info(
        `[WebsiteContactUS], [sendMail], Mail response [${JSON.stringify(
          info
        )}]`
      );
    } catch (mailErr) {
      log.info(
        `[Campaign Email], [sendMail], Mail Error [${JSON.stringify(
          mailErr
        )}]`
      );
    }
    return res.status(200).json({ msg: "We have received  your request, we will contact you soon " });
  } catch (e) {
    log.info(`[WebsiteContactUS], [sendMail], Error [${e}]`);
    res.status(500).json(e);
  }
}


var self = (module.exports = {
  sendMail,
});
