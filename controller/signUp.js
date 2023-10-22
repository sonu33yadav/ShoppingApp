const axios = require("axios");

const http = require("http");
const nodemailer = require("nodemailer");
const https = require("https");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user")
const otpModel = require("../models/otp")
const Email = require("../helper/Email")
const fsPromises = require("fs").promises;
const fs = require("fs");
const { join } = require("path");
const moment = require("moment");
const log = require("../helper/log");
dotenv.config();
const config = process.env;
var multer = require("multer");
var forms = multer();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
var randomstring = require("randomstring");
const { promisify } = require("util");
const util = require("util");
const common = require("../helper/common");
const sendSMS = require("../library/sendSms");
const mv = promisify(fs.rename);

const formidable = require("formidable");

async function SignUp(req, res) {
    try {

        let { name, email, mobile, pass } = req.body;

        log.info(
            `[SignUp], [SignUp], Name [${name}], Email [${email}], Mobile [${mobile}], Password [${pass}]`
        );

        if (!name || !email || !mobile || !pass) {
            log.info(`[SignUp], [SignUp], [Missing Parameter]`);
            return res.status(400).json({ msg: "Missing Parameter" });
        }

        let isExists = await userModel.checkUserbyEmail(email);
        if (isExists) {
            log.info(`[USER], [addUser], [Email address already exists]`);
            return res.status(400).json({ msg: "Email address already exists" });
        }

        mobile = mobile.toString();
        mobile = "91" + mobile.slice(mobile.length - 9, mobile.length);

        isExists = await userModel.checkUserbyMobile(mobile);
        if (isExists) {
            log.info(`[USER], [addUser], [Phone Number already exists]`);
            return res.status(400).json({ msg: "Phone Number already exists" });
        }


        const emailResp = await Email(name, email);
        log.info(`[USER], [addUser], MailResponse [${JSON.stringify(emailResp)}]`);

        const hashedPassword = await bcrypt.hash(pass, 10);
        await userModel.addUserDB(
            name,
            email,
            mobile,
            hashedPassword,
            process.env.CUSTOMER
        );
        var otp = (Math.floor(100000 + Math.random() * 900000));
        log.info(`[USER], [addUser], Otp [${otp}]`);
        await otpModel.addOtp(mobile, otp);

        return res.status(200).json({ msg: "User has been created successfully" });
    } catch (e) {
        log.info(`[USER], [addUser], Error [${e}]`);
        res.status(500).json(e);
    }
}
async function verifyOtp(req, res) {
    try {
        let { mobile, otp } = req.body;

        log.info(
            `[SignUp], [verifyOtp],  Mobile [${mobile}], Otp [${otp}]`
        );

        if (!mobile || !otp) {
            log.info(`[SignUp], [verifyOtp], [Missing Parameter]`);
            return res.status(400).json({ msg: "Missing Parameter" });
        }
        mobile = mobile.toString();
        mobile = "91" + mobile.slice(mobile.length - 9, mobile.length);

        otpExist = await otpModel.getotp(mobile, otp)
        log.info(`[SignUp], [verifyOtp], Otp [${JSON.stringify(otpExist.otp)}]`);
        if (otp == otpExist.otp) {

            userModel.updateClientStatus(process.env.VERIFIED, mobile)
            return res.status(200).json({ msg: "User has been  Verified successfully" });
        }
        return res.status(400).json({ msg: "Plese Enter Correct Otp" });
    } catch (e) {
        log.info(`[USER], [verifyOtp], Error [${e}]`);
        res.status(500).json(e);
    }
}
var self = (module.exports = {
    SignUp,
    verifyOtp
});
