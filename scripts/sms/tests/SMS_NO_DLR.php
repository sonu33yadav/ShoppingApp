<?php
function sendSMS ($msisdn, $msg, $smsc='MTN', $from='TXTCONN')
{
        $user = 'txtgh_url';
        $pwd = 'pass0wd_url';
        $CONFIG_KANNEL_HOST = "62.129.149.188";
        $CONFIG_KANNEL_PORT = "13013";
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

sendSMS ('574612234', 'TEST SMS');

?>
