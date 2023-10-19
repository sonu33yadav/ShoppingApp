const express = require('express');
const app = express();
const log = require('../helper/log');


const myMiddleware = (req, res, next) => {
    // Perform some operations
    log.info("On Route [middlewarelog]");

    // Modify request object
    // req.customData = 'Hello from middleware';

    next();
};

var self = (module.exports = {
    myMiddleware,
});