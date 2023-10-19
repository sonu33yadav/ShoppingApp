<?php
require_once "./KLogger/KLogger.php";
require_once "./helper.php";
require_once "./globals.php";
require_once "./model.php";
$log = new KLogger("./log/", KLogger::DEBUG);
$log->LogInfo("[REQ], " . print_r($_GET, true));
$campaignOwner = $_GET['userId'];
$quickSMSId    = $_GET['quickSMSId'];
$messageId    = $_GET['messageId'];
$type          = $_GET['type'];
$msisdn        = $_GET['receiver'];
$message       = $_GET['message'];
$senderId      = $_GET['senderId'];
if (DELIVERED == $type) {
    $status = 2;
    messageUpdate($quickSMSId, $msisdn, $status);
    smsReportUpdate($messageId, $msisdn, $status);
    campaignDelivered($quickSMSId);
    $log->LogInfo("User Id [$campaignOwner], Quick SMS Id [$quickSMSId], Type [$type], Msisdn [$msisdn], Sms Delivered");
} else if (NOT_DELIVERED == $type) {
    $status = 3;
    messageUpdate($quickSMSId, $msisdn, $status);
    smsReportUpdate($messageId, $msisdn, $status);
    $log->LogInfo("User Id [$campaignOwner], Quick SMS Id [$quickSMSId], Type [$type], Msisdn [$msisdn], Sms Not Delivered");
} else if (NOT_DELIVERED_TO_SMSC == $type) {
    $status = 4;
    messageUpdate($quickSMSId, $msisdn, $status);
    smsReportUpdate($messageId, $msisdn, $status);
    $log->LogInfo("User Id [$campaignOwner], Quick SMS Id [$quickSMSId], Type [$type], Msisdn [$msisdn], SMSC issue failed to send sms");
} else if (EXPIRED == $type) {
    $status = 5;
    messageUpdate($quickSMSId, $msisdn, $status);
    smsReportUpdate($messageId, $msisdn, $status);
    $log->LogInfo("User Id [$campaignOwner], Quick SMS Id [$quickSMSId], Type [$type], Msisdn [$msisdn], SMS Expired");
} else if (DELIVERED_TO_SMSC == $type) {
    // $randNum = random_int(10000, 99999);
    // $message_id = $randNum . date('YmdHis', strtotime($dt));
    // insertmessage($campaignOwner, $quickSMSId, $msisdn, $message, $message_id, $senderId);
}

echo "RECV";
