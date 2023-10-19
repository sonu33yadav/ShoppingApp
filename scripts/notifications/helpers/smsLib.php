<?php

function sendSMS($msisdn, $msg, $from = 'TXTCONNECT', $smsc = 'MTN_BULK')
{
    $user = KANNEL_USER;
    $pwd = KANNEL_PASS;
    $CONFIG_KANNEL_HOST = KANNEL_HOST;
    $CONFIG_KANNEL_PORT = KANNEL_PORT;
    $url = '/cgi-bin/sendsms?username=' . $user
    . '&password=' . $pwd
    . "&to={$msisdn}"
    . "&from={$from}"
    . '&charset=UTF-8&coding=2'
    . '&text=' . urlencode($msg)
        . "&smsc={$smsc}";
    $results = file('http://'
        . $CONFIG_KANNEL_HOST . ':'
        . $CONFIG_KANNEL_PORT . $url);
    return true;
}
