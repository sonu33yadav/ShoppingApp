const opts = {
  errorEventName: "error",
  logDirectory: "logs",
  fileNamePattern: "log-<DATE>.log",
  dateFormat: "YYYY-MM-DD",
};
const log = require("simple-node-logger").createRollingFileLogger(opts);

module.exports = {
  generateApiKey: function () {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 50; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  generatePassword: function () {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  checkingBalance: function (
    controllerName,
    functionName,
    accountBal,
    balanceConsumed,
    type
  ) {
    if (accountBal?.sms < balanceConsumed) {
      log.info(
        `[${controllerName}], [${functionName}], Campaign Type [SMS], Account Balance [${accountBal?.sms}], Balance Consume [${balanceConsumed}], [Insufficient balance to run this campaign]`
      );
      return false;
    } else if (
      process.env.VOICE == type &&
      accountBal?.voice < balanceConsumed
    ) {
      log.info(
        `[${controllerName}], [${functionName}], Campaign Type [VOICE], Account Balance [${accountBal?.voice}], Balance Consume [${balanceConsumed}], [Insufficient balance to run this campaign]`
      );
      return false;
    } else if (
      process.env.EMAIL == type &&
      accountBal?.email < balanceConsumed
    ) {
      log.info(
        `[${controllerName}], [${functionName}], Campaign Type [EMAIL], Account Balance [${accountBal?.email}], Balance Consume [${balanceConsumed}], [Insufficient balance to run this campaign]`
      );
      return false;
    } else {
      return true;
    }
  },
};
