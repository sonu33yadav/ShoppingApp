<?php
require_once "./KLogger/KLogger.php";
require_once "./helper.php";
require_once "./globals.php";
require_once "./model.php";
$log = new KLogger("./log/", KLogger::DEBUG);
$log->LogInfo("[REQ], " . print_r($_GET, true));
$campaignOwner = $_GET['userId'];
$campaignId    = $_GET['campaignId'];
$type          = $_GET['type'];
$msisdn        = $_GET['receiver'];
$message       = $_GET['message'];
$senderId      = $_GET['senderId'];
if (DELIVERED == $type) {
    $status = 2;
    messageUpdate($campaignId, $msisdn, $status);
    smsReportUpdate($campaignId, $msisdn, $status);
    campaignDelivered($campaignId);
    $log->LogInfo("User Id [$campaignOwner], Campaign Id [$campaignId], Type [$type], Msisdn [$msisdn], Sms Delivered");
} else if (NOT_DELIVERED == $type) {
    $status = 3;
    messageUpdate($campaignId, $msisdn, $status);
    smsReportUpdate($campaignId, $msisdn, $status);
    $log->LogInfo("User Id [$campaignOwner], Campaign Id [$campaignId], Type [$type], Msisdn [$msisdn], Sms Not Delivered");
} else if (NOT_DELIVERED_TO_SMSC == $type) {
    $status = 4;
    messageUpdate($campaignId, $msisdn, $status);
    smsReportUpdate($campaignId, $msisdn, $status);
    $log->LogInfo("User Id [$campaignOwner], Campaign Id [$campaignId], Type [$type], Msisdn [$msisdn], SMSC issue failed to send sms");
} else if (EXPIRED == $type) {
    $status = 5;
    messageUpdate($campaignId, $msisdn, $status);
    smsReportUpdate($campaignId, $msisdn, $status);
    $log->LogInfo("User Id [$campaignOwner], Campaign Id [$campaignId], Type [$type], Msisdn [$msisdn], SMS Expired");
} else if (DELIVERED_TO_SMSC == $type) {
    // $randNum = random_int(10000, 99999);
    // $message_id = $randNum . date('YmdHis', strtotime($dt));
    // insertmessage($campaignOwner, $campaignId, $msisdn, $message, $message_id, $senderId);
}

echo "RECV";