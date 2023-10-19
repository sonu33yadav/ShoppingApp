<?php

function sendSMSApi($msisdn, $msg, $from, $campaignId, $userId, $smsc = 'MTN_BULK')
{
    $user = KANNEL_USER;
    $pwd = KANNEL_PASS;
    $CONFIG_KANNEL_HOST = KANNEL_HOST;
    $CONFIG_KANNEL_PORT = KANNEL_PORT;
    $dlr_url = CAMP_DLR_ENDPOINT . "?userId={$userId}&campaignId={$campaignId}&type=%d&receiver=%p&reply=%A&message=%b";
    $url = '/cgi-bin/sendsms?username=' . $user
    . '&password=' . $pwd
    . "&to={$msisdn}"
    . "&from={$from}"
    . '&charset=UTF-8&coding=2'
    . '&text=' . urlencode($msg)
    . "&smsc={$smsc}"
    . '&dlr-url=' . urlencode($dlr_url)
        . '&dlr-mask=31';
    $results = file('http://'
        . $CONFIG_KANNEL_HOST . ':'
        . $CONFIG_KANNEL_PORT . $url);
    return true;
}

function sendSMS($msisdn, $msg, $from, $campaignId, $userId, $smsc = 'MTN_BULK')
{
    if (SMS_SEND_METHOD == "API") {
        sendSMSApi($msisdn, $msg, $from, $campaignId, $userId, $smsc);
    } else {
        $dlrURL = CAMP_DLR_ENDPOINT . "?userId={$userId}&campaignId={$campaignId}&type=%d&receiver=%p&reply=%A&message=%b";
        insertKannelDB($from, $msisdn, $msg, $smsc, $dlrURL, $campaignId);
    }
    return true;
}
