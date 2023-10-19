const axios = require("axios");
const log = require('../helper/log');

const config = process.env;
const sendSMS = async (numbers, message) => {
    try {
        const body = {
            recipient: numbers,
            message,
        };

        // log.info(`[Send SMS], Body ${JSON.stringify(body)}`);

        const { data } = await axios.post(process.env.SMS_REQ_URL, body, {
            headers: {
                "Content-Type": "application/json",
                "Content-Length": JSON.stringify(body).length,
            },
        });

        log.info(`[Send SMS], SMS response ${JSON.stringify(data)}`);

        if (data?.response?.[0]?.messagestatus === "SUCCESS") return true;

        return false;
    } catch (err) {
        log.info(`[Send SMS], Error [${err}]`);
        return false;
    }
};



module.exports =
    sendSMS;