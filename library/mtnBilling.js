
const log = require('../helper/log');
const config = process.env;
const fetch = require('node-fetch');

function mtnBilling(msisdn, amount, transactionId) {
    return new Promise((resolve, reject) => {
        try {
            log.info(`[Send SMS], Msisdn [${msisdn}], amount [${amount}]`);
            const requestBody = {
                username: config.username,
                password: config.password,
                serviceid: config.serviceid,
                clientid: config.clientid,
                amount: config.amount,
                accountno: msisdn,
                msisdn: msisdn,
                currencycode: config.currencycode,
                transactionid: transactionId,
                timestamp: config.timestamp,
                payload: {
                    accounttype: 'MSISDN',
                    narration: 'Test3',
                    currencycode: 'ZMW'
                }
            };

            var apiUrl = config.BILLING_URL;
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
    mtnBilling
    ;