<?php
function sendSMS ($msisdn, $msg, $smsc='MTN')
{
        $code = 'TXTOTP';
        $user = 'txtgh_url';
        $pwd = 'pass0wd_url';
        $CONFIG_KANNEL_HOST = "62.129.149.188";
        $CONFIG_KANNEL_PORT = "13013";
        $dlr_url = "http://20.228.184.53/PROJECTS/TxtGhana/Txtconnect/txtconnect-node-backend/scripts/sendSMS/campaignDLR.php?campaign_owner=11&campaignID=121&type=%d&receiver=%p&reply=%A&time=%t&usr=%n&message=%b";
        $url = '/cgi-bin/sendsms?username=' . $user
                . '&password=' . $pwd
                . "&to={$msisdn}"
                . "&from={$code}"
                . '&charset=UTF-8&coding=2'
                . '&text=' . urlencode($msg)
                . "&smsc={$smsc}"
                        . '&dlr-url=' . urlencode($dlr_url)
                        . '&dlr-mask=31';
                echo 'http://' . $CONFIG_KANNEL_HOST . ':' . $CONFIG_KANNEL_PORT . $url;

        $results = file('http://'
                        . $CONFIG_KANNEL_HOST . ':'
                        . $CONFIG_KANNEL_PORT . $url);
}


$msisdn = "233574612234";
//$msisdn = "919650491686";
//sendSMS ('574612234', 'TEST SMS');
$msg= "TEST SMS WITH DLR 2";
//sendSMS ($msisdn, $msg);
//sendSMS ($msisdn, $msg, 'MTN_BULK');
sendSMS ($msisdn, $msg, 'tigo');
?>
