const contactGroup = require("../models/contactGroup");
const contact = require("../models/contact");
const campaign = require("../models/campaign");
const axios = require("axios");
const senderIdModel = require("../models/senderId");
const apiKeyModel = require("../models/apiKey");
const callerIdModel = require("../models/callerId");
const accountCreditsModel = require("../models/accountCredits");
const smsTemplateModel = require("../models/smsTemplate");
const users = require("../models/user");
const campaignReport = require("../models/campaignReport");
const reports = require("../models/reports");
const reqLib = require("../library/request");
const messageIdGen = require("../library/messageIdGenerate");
const http = require("http");
const nodemailer = require("nodemailer");
const https = require("https");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const readXlsxFile = require("read-excel-file/node");
const excelJS = require("exceljs");
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

async function signUp(req, res) {
  const cName = "CustomerController"; //controller's name
  const fName = "SignUp"; // function's name
  try {
    let { name, email, mode, socialId, mobilenumber } = req.body;

    const mobile = process.env.COUNTRY_CODE + mobilenumber.slice(-9);
    log.info(
      `[${cName}], [${fName}], Name [${name}], Email [${email}], Mode [${mode}], Social Id [${socialId}] Mobile [${mobile}]`
    );

    if (!name || !email || !mode || !mobilenumber) {
      log.info(`${cName}], [${fName}], [Missing parameters]`);
      return res.status(400).json({ msg: "Missing parameters" });
    }
    // const hashPassword = await bcrypt.hash(password, 10);
    const userDetails = await users.UserExistsByEmail(email);
    // log.info(
    //   `${cName}], [${fName}], MId [${m_id}], UserDetail []${JSON.stringify(userDetails)},`
    // );
    if (!userDetails) {
      var m_id = Math.floor(1000 + Math.random() * 9000);
      var identityToken = common.generateApiKey();
      let isExists = await apiKeyModel.checkApiKeyDB(identityToken);
      while (isExists) {
        identityToken = common.generateApiKey();
        isExists = await apiKeyModel.checkApiKeyDB(identityToken);
      }
      log.info(
        `${cName}], [${fName}], MId [${m_id}], IdentityToken [${identityToken}],`
      );

      await users.createUser(m_id, name, email, mobile, identityToken);

      const otp = Math.floor(1000 + Math.random() * 4000);
      //const otp = "1111";
      log.info(`${cName}], [${fName}],  Number [${mobile}], Otp [${otp}]`);

      await users.addOtp(mobile, otp);
      //const sendOtp
      const smsMessage = ` Hi ${userDetails.name}, OTP for your PayGo SMS PORTAL Account for verification is ${otp} `;
      // const isSMSSent = await sendSMS(
      //   [Number(process.env.COUNTRY_CODE + userDetails?.phone)],
      //   smsMessage
      // );

      var baseUrl = "https://messaging.airtel.co.zm:9002/smshttpquery/qs?";
      var newurl = baseUrl + "REQUESTTYPE=SMSSubmitReq" + "&USERNAME=" + process.env.SMS_USERNAME + "&PASSWORD=" + process.env.SMS_PASSWORD + "&MOBILENO=" + mobile + "&MESSAGE=" + smsMessage + "&ORIGIN_ADDR=" + process.env.SMS_USERNAME + "&TYPE=" + 0;
      log.info(`${cName}], [${fName}], [SEND OTP],  url [${newurl}]`);
      await axios
        .get(newurl)
        .then((response) => {
          const parts = response.data.split("|");
          log.info(`${cName}], [${fName}], [SEND OTP],  Respose [${JSON.stringify(parts)}]`);
        })
        .catch((error) => {
          log.info(`${cName}], [${fName}],  Respose TWO [${JSON.stringify(error)}]`);
          console.error("Error:", error);
        });

      log.info(
        `${cName}], [${fName}], OTP [${otp}], isSMSSent [${isSMSSent}], ${isSMSSent ? "OTP has been sent successfully" : ""
        } `
      );

      return res
        .status(200)
        .json({ msg: "OTP has been successfully sent to your mobile number" });
    }

    if (
      userDetails.status == process.env.INACTIVE
    ) {
      log.info(`${cName}], [${fName}],  Email [${email}], Disabled bY Admin`);
      return res.status(400).json({
        msg: "Your Account has been disabled. Please Contact with admin",
      });
    } else if (
      userDetails.status == process.env.ACTIVE
    ) {
      log.info(`${cName}], [${fName}],  Email [${email}], Email Already exist`);
      return res
        .status(400)
        .json({ msg: "Email already linked with another account" });
    }
    // UnVerified User
    else {
      const userId = userDetails.id;
      log.info(
        `${cName}], [${fName}],  Email [${email}], UserId [${userId}], Name [${name}], mobile [${mobile}], Unverified account found`
      );
      await users.updateUserDetail(name, mode, mobile, userId);
      const otp = Math.floor(1000 + Math.random() * 4000);
      // const otp = "1111";
      const smsMessage = ` Hi ${userDetails.name}, OTP for your PayGo SMS PORTAL Account for verification is ${otp} `;
      // const isSMSSent = await sendSMS(
      //   [Number(process.env.COUNTRY_CODE + userDetails?.phone)],
      //   smsMessage
      // );

      var baseUrl = "https://messaging.airtel.co.zm:9002/smshttpquery/qs?";
      var newurl = baseUrl + "REQUESTTYPE=SMSSubmitReq" + "&USERNAME=" + process.env.SMS_USERNAME + "&PASSWORD=" + process.env.SMS_PASSWORD + "&MOBILENO=" + mobile + "&MESSAGE=" + smsMessage + "&ORIGIN_ADDR=" + process.env.SMS_USERNAME + "&TYPE=" + 0;
      log.info(`${cName}], [${fName}], [SEND OTP],  url [${newurl}]`);
      await axios
        .get(newurl)
        .then((response) => {
          const parts = response.data.split("|");
          log.info(`${cName}], [${fName}], [SEND OTP] , OTP [${otp}],  Respose [${JSON.stringify(parts)}]`);
        })
        .catch((error) => {
          log.info(`${cName}], [${fName}], OTP [${otp}], Respose TWO [${JSON.stringify(error)}]`);
          console.error("Error:", error);
        });


      // log.info(
      //   `${cName}], [${fName}], OTP [${otp}], isSMSSent [${isSMSSent}], ${isSMSSent ? "OTP has been sent successfully" : ""
      //   } `
      // );
      await users.addOtp(mobile, otp);
      return res
        .status(200)
        .json({ msg: "OTP has been successfully sent to your mobile number" });
    }
  } catch (e) {
    log.info(`[
            ${cName}], [${fName}], SERVER ERROR [${e}]`);
    res.status(500).json(e);
  }
}

async function otpVerify(req, res) {
  const cName = "Customerjs"; //controller's name
  const fName = "otpVerify"; // function's name

  try {
    let { mobilenumber, otp, email } = req.body;
    log.info(`${cName}], [${fName}], Mobile [${mobilenumber}], Email[${email}] OTP [${otp}]`);

    if (!mobilenumber || !otp) {
      log.info(`${cName}], [${fName}], [Missing parameters]`);
      return res.status(400).json({ msg: "Missing parameters" });
    }
    const mobile = process.env.COUNTRY_CODE + mobilenumber.slice(-9);
    const otpVerify = await users.getOtp(mobile);
    if (otpVerify.otp == otp) {
      const userDetail = await users.getUserByMobile(mobile);

      await users.updateStatus(process.env.VERIFIED, email);

      const userCredits = await accountCreditsModel.checkAccountBal(
        userDetail.id
      );
      log.info(
        `${cName}], [${fName}],  Mobile [${mobile}]  User verified Successfully`
      );
      return res.status(200).json({
        msg: "User verified Successfully",
      });
    }
    log.info(
      `${cName}], [${fName}],  Mobile [${mobile}] Otp [${otp}], Incorrect Otp`
    );
    return res.status(400).json({ msg: "Incorrect OTP" });
  } catch (e) {
    log.info(`${cName}], [${fName}], Error [${e}]`);
    res.status(500).json(e);
  }
}

async function createPassword(req, res) {
  const cName = "CustomerController"; //controller's name
  const fName = "createPassword"; // function's name
  try {
    let { password, email } = req.body;

    log.info(
      `[${cName}], [${fName}], Email [${email}], Password [${password}]`
    );

    if (!email || !password) {
      log.info(`${cName}], [${fName}], [Missing parameters]`);
      return res.status(400).json({ msg: "Missing parameters" });
    }
    const userDetails = await users.UserExistsByEmail(email);

    if (!userDetails) {
      log.info(`${cName}], [${fName}],  Email [${email}], No User Found`);

      return res.status(400).json({ msg: "No User Found" });
    } else if (userDetails.staus == process.env.PENDING) {
      log.info(`${cName}], [${fName}],  Email [${email}], Unverified Account`);
      return res
        .status(400)
        .json({ msg: "Your account hasn't been verified yet" });
    } else if (
      userDetails.status == process.env.INACTIVE
    ) {
      log.info(`${cName}], [${fName}],  Email [${email}], Disabled by Admin`);
      return res.status(400).json({
        msg: "Your Account has been disabled. Please Contact with admin",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await users.createPasswordDB(email, hashPassword);
    users.updateStatus(process.env.ACTIVE, email);
    const token = jwt.sign(
      {
        user_id: userDetails.id,
        type: userDetails.type,
        email: userDetails.email,
      },
      "token",
      // { expiresIn: "1h" }
    );
    let user_id = userDetails.id;
    log.info(`${cName}], [${fName}], UserId [${user_id}]`);
    await users.accountcredits(user_id, process.env.SMS_CREDITS);
    const userCredits = await accountCreditsModel.checkAccountBal(
      userDetails.id
    );
    log.info(
      `${cName}], [${fName}],  Email [${email}], Password created successfully`
    );

    return res
      .status(200)
      .json({
        msg: "Password has been created successfully",
        token: token,
        userId: userDetails.id,
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
        type: userDetails.type,
        permissions: userDetails.permissions,
        address: userDetails.address,
        city: userDetails.city,
        state: userDetails.state_name,
        country: userDetails.country,
        credits: userCredits,
      });
  } catch (e) {
    log.info(`[
            ${cName}], [${fName}], SERVER ERROR [${e}]`);
    res.status(500).json(e);
  }
}

async function login(req, res) {
  const cName = "CustomerController";
  const fName = "login";
  try {
    let { loginId, password, mode } = req.body;
    log.info(
      `${cName}], [${fName}], LoginId [${loginId}], Password [${password}], Mode [${mode}],]`
    );
    if (!loginId || !password) {
      log.info(`${cName}], [${fName}], [Missing parameters]`);
      return res.status(400).json({ msg: "Missing parameters" });
    }
    if (process.env.EMAIL_MODE == mode) {
      const userDetail = await users.checkUserByEmail(loginId);
      if (!userDetail) {
        log.info(
          `${cName}], [${fName}],  Given email id is not registered with us`
        );
        return res.status(400).json({ msg: "Invalid email or password" });
      }
      const match = await bcrypt.compare(password, userDetail.password);
      if (!match) {
        // Passwords match
        log.info(`${cName}], [${fName}],  Password mis-match`);
        return res
          .status(400)
          .json({ msg: "Please enter correct email or password." });
      }

      if (userDetail.status == process.env.INACTIVE) {
        log.info(
          `${cName}], [${fName}], LoginId [${loginId}], Password [${password}], User Inactive]`
        );
        return res.status(400).json({
          msg: "Your account has been disabled. Kindly contact admin.",
        });
      }

      if (userDetail.status == process.env.PENDING) {
        log.info(
          `${cName}], [${fName}], LoginId [${loginId}], Password [${password}],  User unverified]`
        );
        return res.status(400).json({
          msg: "Given email id is not registered with us",
        });
      }

      const token = jwt.sign(
        {
          user_id: userDetail.id,
          type: userDetail.type,
          email: userDetail.email,
        },
        "token",
        // { expiresIn: "1h" }
      );
      const userCredits = await accountCreditsModel.checkAccountBal(
        userDetail.id
      );
      log.info(
        `${cName}], [${fName}], User Id [${userDetail.id}], Email [${loginId}], Customer Login Successfully, token ${token}`
      );
      return res.status(200).json({
        token: token,
        userId: userDetail.id,
        name: userDetail.name,
        email: userDetail.email,
        phone: userDetail.phone,
        type: userDetail.type,
        address: userDetail.address,
        city: userDetail.city,
        state: userDetail.state_name,
        country: userDetail.country,
        permissions: userDetail.permissions,
        credits: userCredits,
      });
    } else {
      //User SocialId
      const userDetailbysocialid = await users.checkUserBySocialId(loginId);
      if (!userDetailbysocialid) {
        log.info(
          `${cName}], [${fName}], LoginId [${loginId}], account is not linked with us ]`
        );
        return res.status(400).json({
          msg: "Account is not registered with us. Kindly register & try again",
        });
      }
      if (userDetailbysocialid.status == process.env.INACTIVE) {
        log.info(
          `${cName}], [${fName}], LoginId [${loginId}],  User is Inactive]`
        );
        return res.status(400).json({
          msg: "Your account has been disabled. Kindly contact admin.",
        });
      } else if (userDetail.stauts == process.env.PENDING) {
        log.info(
          `${cName}], [${fName}], LoginId [${loginId}], Password [${password}] User unverified`
        );
        return res.status(400).json({
          msg: "Given email id is not registered with us",
        });
      } else {
        //verified User
        const token = jwt.sign(
          {
            user_id: userDetailbysocialid.id,
            type: userDetailbysocialid.type,
            email: userDetailbysocialid.email,
          },
          "token",
          // { expiresIn: "1h" }
        );
        const userCredits = await accountCreditsModel.checkAccountBal(
          userDetailbysocialid.id
        );
        log.info(
          `${cName}], [${fName}], Email [${loginId}], Password[${userDetailbysocialid.Password}], Customer Login Successfully`
        );
        return res.status(200).json({
          msg: "User Signin Sucessfully",
          token: token,
          userDetail: userDetailbysocialid,
          credits: userCredits,
        });
      }
    }
  } catch (e) {
    log.info(`${cName}], [${fName}], Error [${e}]`);
    res.status(500).json(e);
  }
}
async function changePassword(req, res) {
  const cName = "CustomerController"; //controller's name
  const fName = "changePassword"; // function's name
  try {
    const userId = req.headers.id;

    let { currentPassword, newPassword } = req.body;
    log.info(
      `${cName}], [${fName}], UserId [${userId}], oldPassword [${currentPassword}], newPassword [${newPassword}]]`
    );
    if (!currentPassword || !newPassword) {
      log.info(`${cName}], [${fName}], [Missing parameters]`);
      return res.status(400).json({ msg: "Missing parameters" });
    }
    const getUserByid = await users.isUserExist(userId);

    if (getUserByid && getUserByid.status == process.env.ACTIVE) {
      const dbPassword = getUserByid.password;
      const match = await bcrypt.compare(currentPassword, dbPassword);
      if (!match) {
        // Passwords match
        log.info(`${cName}], [${fName}],  Password mis-match`);
        return res
          .status(400)
          .json({ msg: "Please enter correct password." });
      }
      const newhashPassword = await bcrypt.hash(newPassword, 10);
      log.info(
        `${cName}], [${fName}], UserId [${userId}], password Updated Successfully`
      );
      await users.changeUserPassword(newhashPassword, userId);
      return res.status(200).json({ msg: "Password Updated sucessfully" });
    }
    log.info(`${cName}], [${fName}], UserId [${userId}], User Not Found`);
    return res.status(400).json({ msg: "Not registered with us." });
  } catch (e) {
    log.info(`${cName}], [${fName}], Error [${e}]`);
    res.status(500).json(e);
  }
}
async function forgotPassword(req, res) {
  const cName = "CustomerController"; //controller's name
  const fName = "forgotPassword"; // function's name
  try {
    const userId = req.headers.user_id;
    let { email } = req.body;
    if (!email) {
      log.info(`${cName}], [${fName}], [Missing parameters]`);
      return res.status(400).json({ msg: "Missing parameters" });
    }
    //Email part is remaining
    const getuserDetialByEmail = await users.checkUserEmail(email);
    if (getuserDetialByEmail) {
      const newPassword = (Math.random() + 1).toString(36).substring(2);
      const hashPassword = await bcrypt.hash(newPassword, 10);
      const userId = getuserDetialByEmail.id;
      log.info(
        `${cName}], [${fName}], UserId [${userId}], Email [${email}] password [${newPassword}] [passwordUpdated]`
      );
      await users.changeUserPassword(hashPassword, userId);
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const loginLink = process.env.SITE_LINK + "/login";
      const siteLink = process.env.SITE_LINK;
      let info = await transporter.sendMail({
        from: process.env.EMAIL_SENDER, // sender address
        to: email, // list of receivers
        subject: "Forget password", //Subject line
        html: `<p>Hi There,<BR><BR>Your account password has been reset successfully. Please find your new system generated credentials below. Kindly change the password after login.<BR><BR>Url : <a href='${loginLink}'>${loginLink}</a> <BR>Login Id : <b>${email}</b> <BR>Password : <b>${newPassword}</b></p><BR><p>Thanks, <BR>Team TxtConnect<BR><a href='${siteLink}'>${siteLink}</a></p>`, // html body
      });
      log.info(
        `${cName}], [${fName}], Email [${email}], MailResponse [${JSON.stringify(
          info
        )}][ Mail Sent To user] `
      );
      return res
        .status(200)
        .json({ msg: "You will receive mail shortly with new credentials." });
    }
    log.info(
      `${cName}], [${fName}], Email [${email}][email Not Registerd with us ]`
    );
    return res.status(400).json({ msg: "Account not registerd with us" });
  } catch (e) {
    log.info(`${cName}], [${fName}], Error [${e}]`);
    res.status(500).json(e);
  }
}

async function updateProfile(req, res) {
  const cName = "CustomerController"; //controller's name
  const fName = "updateProfile";
  try {
    const userId = req.headers.id;
    let { fullName, address, city, state, country } = req.body;
    log.info(
      `${cName}], [${fName}], UserId [${userId}], Name [${fullName}] Address [${address}], City [${city}], state [${state}], Country [${country}] `
    );
    if ((!fullName, !address, !city, !state, !country)) {
      log.info(`${cName}], [${fName}], [Missing parameters]`);
      return res.status(400).json({ msg: "Missing parameters" });
    }
    const userDetail = await users.isUserExist(userId);
    if (userDetail && userDetail.status == process.env.ACTIVE) {
      await users.updateUserProfile(
        fullName,
        address,
        city,
        state,
        country,
        userId
      );
      log.info(
        `${cName}], [${fName}], UserId [${userId}], Name [${fullName}] Address [${address}], City [${city}], state [${state}[Profile Updated]`
      );
      return res.status(200).json({ msg: "Profile Updated sucessfully" });
    }
    log.info(
      `${cName}], [${fName}], UserId [${userId}], [Profile Not  Updated]`
    );
    return res.status(400).json({ msg: "Couldn't  Update Profile" });
  } catch (e) {
    log.info(`${cName}], [${fName}], Error [${e}]`);
    res.status(500).json(e);
  }
}

async function resendOtp(req, res) {
  const cName = "CustomerController"; //controller's name
  const fName = "resendOtp";
  try {
    //const userId = req.headers.user_id;
    let { mobileNumber } = req.body;
    log.info(`${cName}], [${fName}], Number [${mobileNumber}]`);
    if (!mobileNumber) {
      log.info(`${cName}], [${fName}], [Missing parameters]`);
      return res.status(400).json({ msg: "Missing parameters" });
    }
    const mobile = process.env.COUNTRY_CODE + mobileNumber.slice(-9);
    const userDetail = users.getUserByMobile(mobile);
    if (userDetail) {
      const otp = Math.floor(1000 + Math.random() * 4000);
      log.info(`${cName}], [${fName}], Mobile [${mobile}], Otp [${otp}]`);
      const smsMessage = ` Hi ${userDetail.name}, OTP for your PayGo SMS PORTAL Account for verification is ${otp} `;
      const isSMSSent = await sendSMS(
        [Number(process.env.COUNTRY_CODE + userDetail?.phone)],
        smsMessage
      );

      log.info(
        `${cName}], [${fName}], Number [${mobile}], OTP [${otp}], isSMSSent [${isSMSSent}], OTP has been sent successfully `
      );

      return res
        .status(200)
        .json({ msg: "OTP has been successfully sent to your mobile number" });
    }
    log.info(
      `${cName}], [${fName}], Number [${mobile}], Mobile number is not registered with us`
    );

    return res
      .status(200)
      .json({ msg: "Mobile number is not registered with us" });
  } catch (e) {
    log.info(`${cName}], [${fName}], Error [${e}]`);
    res.status(500).json(e);
  }
}

var self = (module.exports = {
  signUp,
  otpVerify,
  login,
  changePassword,
  forgotPassword,
  updateProfile,
  resendOtp,
  createPassword,
});
