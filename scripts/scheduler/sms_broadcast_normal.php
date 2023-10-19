<?php
chdir(dirname(__FILE__));
require_once './PHPExcel-1.8/Classes/PHPExcel.php';
require_once "./KLogger/KLogger.php";
require_once "./helpers/globals.php";
require 'common.php';
require "./helpers/SendsmsLib.php";

$log = new KLogger("./log_sms_normal/", KLogger::DEBUG);
$campaignId = $argv[1];
$log->LogInfo("[SMS CAMPAIGN], [NORMAL], Campaign Id [$campaignId]");
$campaignDetails = getSingleCampaign($campaignId);

if (false == $campaignDetails) {
    $log->LogInfo("[SMS CAMPAIGN], [NORMAL], Campaign Id [$campaignId]");
} else {

    $groupId = $campaignDetails['group_id'];
    $userId = $campaignDetails['user_id'];
    $groupName = $campaignDetails['group_name'];
    $senderId = $campaignDetails['sender_id'];
    $message = $campaignDetails['message'];
    $campaignName = $campaignDetails['name'];
    $contacts = getGroupContacts($groupId);
    $numberOfContacts = count($contacts);
    //Heading
    //Heading
    mkdir(DEFAULT_DIR . "/$campaignId");
    if (false == $contacts) {
        $log->LogInfo("[SMS CAMPAIGN], [NORMAL], User Id [$userId], Campaign Id [$campaignId], Campaign Name [$campaignName], Group Id [$groupId], Group Name [$groupName],  No Contacts Found");
    } else {

        $objPHPExcel = new PHPExcel();
        //$fileName = date("Y-m-d") . ".xls";
        $fileName = $campaignId . ".xls";
        $count = 1;
        $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue("A$count", 'First Name')
            ->setCellValue("B$count", 'Last Name')
            ->setCellValue("C$count", 'Email')
            ->setCellValue("D$count", 'Mobile')
            ->setCellValue("E$count", 'Sender Id')
            ->setCellValue("F$count", 'Campaign Name')
            ->setCellValue("G$count", 'Status')
            ->setCellValue("H$count", 'Message')
            ->setCellValue("I$count", 'MessageId')
            ->setCellValue("J$count", 'CreatedAt');
        $log->LogInfo("[SMS CAMPAIGN], [NORMAL], User Id [$userId], Campaign Id [$campaignId], Campaign Name [$campaignName], Group Id [$groupId], Group Name [$groupName], Broadcast count [$numberOfContacts], Message [$message]");
        $count = $count + 1;
        $ncount = 0;
        foreach ($contacts as $contact) {
            $mobile = $contact['mobile'];
            if (strlen($mobile) != 12) {
                continue;
            }

            // sendSMS($mobile, $message, $senderId, $campaignId, $userId, 'MTN_BULK');
            $log->LogInfo("[SMS CAMPAIGN], [NORMAL], User Id [$userId], Campaign Id [$campaignId], Campaign Name [$campaignName], Group Id [$groupId], Group Name [$groupName], Mobile [$mobile], SMS Sent");

            $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue("A$count", $contact['first_name'])
                ->setCellValue("B$count", $contact['last_name'])
                ->setCellValue("C$count", $contact['email'])
                ->setCellValue("D$count", $mobile)
                ->setCellValue("E$count", $senderId)
                ->setCellValue("F$count", $campaignName)
                ->setCellValue("G$count", 'Sent')
                ->setCellValue("H$count", $message);
            $ncount = $ncount + 1;
            $messageId = date('YmdHis') . $userId . $campaignId . time() . rand(1000, 9999);
            $response = sendSMSApi($mobile, $message);
            $parts = explode('","', $response);
            $messageId = $parts[2];
            $status = $parts[3];
            $log->LogInfo("[CUSTOM SMS CAMPAIGN], [NORMAL], SMSRESPONSE  [$response], MESSAGEID  [$messageId] STATUS [$status] SMS Sent");
            if ($status == "Success") {
                addCampaignReport($userId, $contact['first_name'], $contact['last_name'], $contact['email'], $campaignId, $groupId, '1', $senderId, '', $mobile, $message, 2);
            } else {
                addCampaignReport($userId, $contact['first_name'], $contact['last_name'], $contact['email'], $campaignId, $groupId, '1', $senderId, '', $mobile, $message, 3);
            }
            updateCampaignSuccessCount($ncount, $campaignId);
            updatemessageId($messageId, $campaignId, $mobile);

        }
        $objPHPExcel->getActiveSheet()->setTitle('Campaign Details');
        $objPHPExcel->setActiveSheetIndex(0);

        // Save Excel 2007 file

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->save(DEFAULT_DIR . "$campaignId/$fileName");
    }
}
$fileUrl = FILEPATH_URL . "/upload/campaign/$campaignId/$fileName";
updateCampaign($campaignId, COMPLETED_STATUS);

updateCampaignFileUrl($campaignId, $fileUrl);

$log->LogInfo("[SMS CAMPAIGN], [NORMAL], Campaign Id [$campaignId], Ended");
