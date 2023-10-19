var request = require('request');

const config = process.env;


function generateMessageId(userId, campaignId) {
    
        try {
            const dateObject = new Date();
            const date = (`0 ${dateObject.getDate()}`).slice(-2);
            const month = (`0 ${dateObject.getMonth() + 1}`).slice(-2);
            const year = dateObject.getFullYear();
            const hours = dateObject.getHours();
            const minutes = dateObject.getMinutes();
            const seconds = dateObject.getSeconds();
            const timestamp = Date.now();
            let randomNum = Math.floor((Math.random() * 1000) + 9999);
            let returnId = `${year}${month}${date}${hours}${minutes}${seconds}${userId}${campaignId}${timestamp}${randomNum}`;
            return returnId.split(" ").join("");
        } catch (err) {
          return err;
        }
  };

module.exports = {generateMessageId};

