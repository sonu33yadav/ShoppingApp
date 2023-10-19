var request = require('request');
const kannelModel = require("../models/kannel");
const config = process.env;


function sendSMSWithDlrApi (from, msisdn, userId, campaignId, msg, smsc) {
    return new Promise((resolve, reject) => {
        //const from ="TXTCONN";
        const KANNEL_USER = config.KANNEL_USER;
        const KANNEL_PASS = config.KANNEL_PASS;
        const KANNEL_HOST = config.KANNEL_HOST;
        const KANNEL_PORT = config.KANNEL_PORT;
        let DLR_URL = `${config.CAMP_DLR_ENDPOINT}?userId=${userId}&campaignId=${campaignId}&type=%d&receiver=%p&reply=%A&time=%t&usr=%n&message=%b`;
        let SMS_URL = `http://${KANNEL_HOST}:${KANNEL_PORT}/cgi-bin/sendsms?username=${KANNEL_USER}&password=${KANNEL_PASS}`;
        SMS_URL = SMS_URL+ `&to=${msisdn}`;
        SMS_URL = SMS_URL+ `&from=${from}`;
        SMS_URL = SMS_URL+ `&charset=UTF-8&coding=2`
        SMS_URL = SMS_URL+ `&text=${encodeURIComponent(msg)}`;
        SMS_URL = SMS_URL+ `&smsc=${smsc}`;
        SMS_URL = SMS_URL+ `&dlr-url=${encodeURIComponent(DLR_URL)}`;
        SMS_URL = SMS_URL+ '&dlr-mask=31';
        console.log("SMS_URL: " + SMS_URL);
        try {
            request({
                uri: SMS_URL,
                method: 'GET'
            }, function (err, res, body) {
                console.log("ERRR: " + err);
                console.log("RESP: " + res);
                console.log("BODY: " + body);
                
                resolve(res || err )
            });
          
        } catch (err) {
          return reject(err);
        }
    });
  };

  function sendQuickSMSWithDlrApi (from, msisdn, userId, quickSMSId, msgId, msg, smsc) {
    return new Promise((resolve, reject) => {
        //const from ="TXTCONN";
        const KANNEL_USER = config.KANNEL_USER;
        const KANNEL_PASS = config.KANNEL_PASS;
        const KANNEL_HOST = config.KANNEL_HOST;
        const KANNEL_PORT = config.KANNEL_PORT;
        let DLR_URL = `${config.QUICK_DLR_ENDPOINT}?userId=${userId}&quickSMSId=${quickSMSId}&messageId=${msgId}&type=%d&receiver=%p&reply=%A&time=%t&usr=%n&message=%b`;
        let SMS_URL = `http://${KANNEL_HOST}:${KANNEL_PORT}/cgi-bin/sendsms?username=${KANNEL_USER}&password=${KANNEL_PASS}`;
        SMS_URL = SMS_URL+ `&to=${msisdn}`;
        SMS_URL = SMS_URL+ `&from=${from}`;
        SMS_URL = SMS_URL+ `&charset=UTF-8&coding=2`
        SMS_URL = SMS_URL+ `&text=${encodeURIComponent(msg)}`;
        SMS_URL = SMS_URL+ `&smsc=${smsc}`;
        SMS_URL = SMS_URL+ `&dlr-url=${encodeURIComponent(DLR_URL)}`;
        SMS_URL = SMS_URL+ '&dlr-mask=31';
        console.log("SMS_URL: " + SMS_URL);
        try {
            request({
                uri: SMS_URL,
                method: 'GET'
            }, function (err, res, body) {
                console.log("ERRR: " + err);
                console.log("RESP: " + res);
                console.log("BODY: " + body);
                resolve(true)
            });
          
        } catch (err) {
            console.log("ERRR: " + err);
          return reject(err);
        }
    });
  };

  function sendSmsApi (msisdn, msg, from="TXTCONN", smsc="MTN_BULK") {
    return new Promise((resolve, reject) => {
        //const from ="TXTCONN";
        const KANNEL_USER = config.KANNEL_USER;
        const KANNEL_PASS = config.KANNEL_PASS;
        const KANNEL_HOST = config.KANNEL_HOST;
        const KANNEL_PORT = config.KANNEL_PORT;
        let SMS_URL = `http://${KANNEL_HOST}:${KANNEL_PORT}/cgi-bin/sendsms?username=${KANNEL_USER}&password=${KANNEL_PASS}`;
        SMS_URL = SMS_URL+ `&to=${msisdn}`;
        SMS_URL = SMS_URL+ `&from=${from}`;
        SMS_URL = SMS_URL+ `&charset=UTF-8&coding=2`
        SMS_URL = SMS_URL+ `&text=${encodeURIComponent(msg)}`;
        SMS_URL = SMS_URL+ `&smsc=${smsc}`;
        console.log("SMS_URL: " + SMS_URL);
        try {
            request({
                uri: SMS_URL,
                method: 'GET'
            }, function (err, res, body) {
                console.log("ERRR: " + err);
                console.log("RESP: " + res);
                console.log("BODY: " + body);
                
                resolve(res || err )
            });
          
        } catch (err) {
          return reject(err);
        }
    });
  };

  async  function sendSMSWithDLR (from, msisdn, userId, campaignId, msg, smsc) {
    
    if(config.SENDSMSMODE =='DBINSERT')
    {
        let DLR_URL = `${config.CAMP_DLR_ENDPOINT}?userId=${userId}&campaignId=${campaignId}&type=%d&receiver=%p&reply=%A&time=%t&usr=%n&message=%b`;
        try {
            await kannelModel.insertSendSmsWithDlrDB(from, msisdn, msg ,smsc, DLR_URL,campaignId);
            return true;
        } catch (err) {
            return false;
        }
    }
    else
    {
        return await sendSMSWithDlrApi(from, msisdn, userId, campaignId, msg, smsc);   
    }
  };

  async  function sendQuickSMSWithDLR (from, msisdn, userId, quickSMSId, msgId, msg, smsc) {
    
    if(config.SENDSMSMODE =='DBINSERT')
    {
        let DLR_URL = `${config.QUICK_DLR_ENDPOINT}?userId=${userId}&quickSMSId=${quickSMSId}&messageId=${msgId}&type=%d&receiver=%p&reply=%A&time=%t&usr=%n&message=%b`;
        try {
            await kannelModel.insertSendSmsWithDlrDB(from, msisdn, msg ,smsc, DLR_URL,quickSMSId);
            return true;
        } catch (err) {
            return false;
        }
    }
    else
    {
        return await sendQuickSMSWithDlrApi(from, msisdn, userId, quickSMSId, msgId, msg, smsc);   
    }
  };

  async  function sendSMS (msisdn, msg, from="TXTCONN", smsc="MTN_BULK") {
    
    if(config.SENDSMSMODE =='DBINSERT')
    {
        try {
            await kannelModel.insertSendSmsWithoutDlrDB(from, msisdn, msg ,smsc,0);
            return true;
        } catch (err) {
            return false;
        }
    }
    else
    {
        return await sendSmsApi(msisdn, msg);   
    }
  };

  

module.exports = {sendSMSWithDLR, sendQuickSMSWithDLR, sendSMS};

