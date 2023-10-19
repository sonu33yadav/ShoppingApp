<?php
chdir(dirname(__FILE__));
require_once './PHPExcel-1.8/Classes/PHPExcel.php';

require_once "./KLogger/KLogger.php";
require_once "./helpers/globals.php";
require 'common.php';
require "./helpers/SendsmsLib.php";

$log = new KLogger("./log_sms_custom/", KLogger::DEBUG);
$campaignId = $argv[1];
$log->LogInfo("[SMS CAMPAIGN], [CUSTOM], Campaign Id [$campaignId]");
$campaignDetails = getSingleCampaign($campaignId);

if (false == $campaignDetails) {

    $log->LogInfo("[CUSTOM SMS CAMPAIGN], [CUSTOM], Campaign Id [$campaignId]");
} else {
    $groupId = $campaignDetails['group_id'];
    $userId = $campaignDetails['user_id'];
    $groupName = $campaignDetails['group_name'];
    $senderId = $campaignDetails['sender_id'];
    $templateId = $campaignDetails['template_id'];
    $campaignName = $campaignDetails['name'];
    $template = getSingleTemplate($templateId);
    $templateMessage = $template['data'];
    $templateName = $template['name'];
    $contacts = getGroupContacts($groupId);
    $numberOfContacts = count($contacts);

    mkdir(DEFAULT_DIR . "/$campaignId");
    if (false == $contacts) {
        $log->LogInfo("[CUSTOM SMS CAMPAIGN], [NORMAL], Campaign Id [$campaignId], Campaign Name [$campaignName], Group Id [$groupId], Group Name [$groupName],  No Contacts Found");
    } else {
        $objPHPExcel = new PHPExcel();
        //$fileName = date("Y-m-d") . ".xls";
        $fileName = $campaignId . ".xls";
        $count = 0;
        $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue("A$count", 'First Name')
            ->setCellValue("B$count", 'Last Name')
            ->setCellValue("C$count", 'Email')
            ->setCellValue("D$count", 'Mobile')
            ->setCellValue("E$count", 'Sender Id')
            ->setCellValue("F$count", 'Campaign Name')
            ->setCellValue("G$count", 'Status')
            ->setCellValue("H$count", 'Message');
        $log->LogInfo("[CUSTOM SMS CAMPAIGN], [CUSTOM], Campaign Id [$campaignId], Campaign Name [$campaignName], Group Id [$groupId], Group Name [$groupName], Broadcast count [$numberOfContacts], Template Id [$templateId], Template Name [$templateName]");
        $count = $count + 1;
        foreach ($contacts as $contact) {
            $message = $templateMessage;
            $firstName = $contact['first_name'];
            $lastName = $contact['last_name'];
            $mobile = $contact['mobile'];
            $email = $contact['email'];

            if (strlen($mobile) != 12) {
                continue;
            }

            $message = str_replace("{{First Name}}", $firstName . " ", $message);
            $message = str_replace("{{Last Name}}", $lastName . " ", $message);
            $message = str_replace("{{Mobile Number}}", $mobile . " ", $message);
            $message = str_replace("{{Email}}", $email . " ", $message);

            // sendSMS($mobile, $message, $senderId, $campaignId, $userId, 'MTN_BULK');

            $log->LogInfo("[CUSTOM SMS CAMPAIGN], [CUSTOM], Campaign Id [$campaignId], Campaign Name [$campaignName], Group Id [$groupId], Group Name [$groupName], Mobile [$mobile], Message [$message], SMS Sent");

            $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue("A$count", $contact['first_name'])
                ->setCellValue("B$count", $contact['last_name'])
                ->setCellValue("C$count", $contact['email'])
                ->setCellValue("D$count", $mobile)
                ->setCellValue("E$count", $senderId)
                ->setCellValue("F$count", $campaignName)
                ->setCellValue("G$count", 'Sent')
                ->setCellValue("H$count", $message);
            $ncount = $count + 1;
            $response = sendSMSApi($mobile, $message);
            $parts = explode('","', $response);
            $messageId = $parts[2];
            $status = $parts[3];

            $log->LogInfo("[CUSTOM SMS CAMPAIGN], [CUSTOM], SMSRESPONSE[$response],  Status[$status], MessageId [$messageId] SMS Sent");
            if ($status == "Success") {
                addCampaignReport($userId, $contact['first_name'], $contact['last_name'], $contact['email'], $campaignId, $groupId, '1', $senderId, $templateName, $mobile, $message, 2);
            } else {
                addCampaignReport($userId, $contact['first_name'], $contact['last_name'], $contact['email'], $campaignId, $groupId, '1', $senderId, $templateName, $mobile, $message, 3);
            }
            updateCampaignSuccessCount($ncount, $campaignId);
            updatemessageId($messageId, $campaignId, $mobile);
        }

        $objPHPExcel->getActiveSheet()->setTitle('Campaign Details');
        // Set active sheet index to the first sheet, so Excel opens this as the first sheet
        $objPHPExcel->setActiveSheetIndex(0);
        // Save Excel 2007 file

        $callStartTime = microtime(true);
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->save(DEFAULT_DIR . "/$campaignId/$fileName");
    }
}
$fileUrl = FILEPATH_URL . "/upload/campaign/$campaignId/$fileName";
updateCampaign($campaignId, COMPLETED_STATUS);
updateCampaignFileUrl($campaignId, $fileUrl);
$log->LogInfo("[CUSTOM SMS CAMPAIGN], [NORMAL], Campaign Id [$campaignId], Ended");
