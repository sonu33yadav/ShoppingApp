
const log = require('../helper/log');
const config = process.env;
const fetch = require('node-fetch');


function getStatus(refrenceId) {
    return new Promise((resolve, reject) => {
        try {
            log.info(`[BILLING], RefrenceId [${refrenceId}]`);
            const requestBody = {
                username: config.username,
                password: config.password,
                serviceid: config.serviceid,
                clientid: config.clientid,
                transactionid: config.transactionid,
            };
            var apiUrl = config.MTN_STATUS_URL;
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
                .then(response => response.json())
                .then(data => {

                    resolve(data);
                })
                .catch(error => {
                    log.info(`[BILLING], Error [${error}]`);
                });


        } catch (err) {
            log.info(`[BILLING], Error [${err}]`);
            return false;
        }
    });
};

module.exports =
    getStatus
    ;