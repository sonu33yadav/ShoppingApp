<?php
require_once "./KLogger/KLogger.php";
require_once "./helper.php";
require_once "./globals.php";
$log = new KLogger("./log_camp/", KLogger::DEBUG);
$log->LogInfo("[REQ], ". print_r($_GET, true));
$campaignOwner = $_GET['campaignOwner'];
$campaignId = $_GET['campaignId'];
$type = $_GET['type'];
$msisdn = $_GET['receiver'];
$message = $_GET['message'];
if(DELIVERED == $type)
{
	$log->LogInfo("User Id [$campaignOwner], Campaign Id [$campaignId], Type [$type], Msisdn [$msisdn], Sms Delivered");
}
else if(NOT_DELIVERED == $type)
{
	$log->LogInfo("User Id [$campaignOwner], Campaign Id [$campaignId], Type [$type], Msisdn [$msisdn], Sms Not Delivered");
}
else if(NOT_DELIVERED_TO_SMSC == $type)
{
	$log->LogInfo("User Id [$campaignOwner], Campaign Id [$campaignId], Type [$type], Msisdn [$msisdn], SMSC issue failed to send sms");
}
else if(EXPIRED == $type)
{
        $log->LogInfo("User Id [$campaignOwner], Campaign Id [$campaignId], Type [$type], Msisdn [$msisdn], SMS Expired");
}

echo "RECV";
?>
