const opts = {
    errorEventName: "error",
    logDirectory: "logs",
    fileNamePattern: "log-<DATE>.log",
    dateFormat: "YYYY-MM-DD",
  };
  const log = require("simple-node-logger").createRollingFileLogger(opts);

module.exports = log;