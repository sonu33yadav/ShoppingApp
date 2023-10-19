<?php
chdir(dirname(__FILE__));
require_once './PHPExcel-1.8/Classes/PHPExcel.php';

require_once "./KLogger/KLogger.php";
require_once "./helpers/globals.php";
require_once "./helpers/emailLib.php";
require 'common.php';
$log             = new KLogger("./log_email_custom/", KLogger::DEBUG);
$campaignId      = $argv[1];
$campaignDetails = getSingleEmailCampaign($campaignId);

if (false == $campaignDetails) {

    $log->LogInfo("[CUSTOM EMAIL CAMPAIGN], [CUSTOM], Campaign Id [$campaignId] nothing found");
    exit();
} else {
    $groupId          = $campaignDetails['group_id'];
    $userId           = $campaignDetails['user_id'];
    $groupName        = $campaignDetails['group_name'];
    $senderId         = $campaignDetails['sender_id'];
    $templateId       = $campaignDetails['template_id'];
    $campaignName     = $campaignDetails['name'];
    $subject          = $campaignDetails['subject'];
    $attachment       = $campaignDetails['attachment'];
    $template         = getSingleTemplate($templateId);
    $templateMessage  = $template['data'];
    $templateName     = $template['name'];
    $contacts         = getGroupContacts($groupId);
    $numberOfContacts = count($contacts);
    if (false == $contacts) {
        $log->LogInfo("[CUSTOM EMAIL CAMPAIGN], [CUSTOM], Campaign Id [$campaignId], Campaign Name [$campaignName], Group Id [$groupId], Group Name [$groupName],  No Contacts Found");
    } else {
        mkdir(DEFAULT_DIR . "/$campaignId");
        $objPHPExcel = new PHPExcel();
        //$fileName = date("Y-m-d") . ".xls";
        $fileName = $campaignId . ".xls";
        $count    = 1;
        $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue("A$count", 'First Name')
            ->setCellValue("B$count", 'Last Name')
            ->setCellValue("C$count", 'Email')
            ->setCellValue("D$count", 'Mobile')
            ->setCellValue("E$count", 'Sender Id')
            ->setCellValue("F$count", 'Campaign Name')
            ->setCellValue("G$count", 'Status')
            ->setCellValue("H$count", 'Message');
        $log->LogInfo("[CUSTOM EMAIL CAMPAIGN], [CUSTOM], Campaign Id [$campaignId], Campaign Name [$campaignName], Group Id [$groupId], Group Name [$groupName], Broadcast count [$numberOfContacts], Template Id [$templateId], Template Name [$templateName], Subject [$subject]");
        $count = $count + 1;
        foreach ($contacts as $contact) {
            $message   = $templateMessage;
            $firstName = $contact['first_name'];
            $lastName  = $contact['last_name'];
            $mobile    = $contact['mobile'];
            $email     = $contact['email'];
            if (strlen($email) < 2) {
                continue;
            }

            $message = str_replace("{{First Name}}", $firstName . " ", $message);
            $message = str_replace("{{Last Name}}", $lastName . " ", $message);
            $message = str_replace("{{Mobile Number}}", $mobile . " ", $message);
            $message = str_replace("{{Email}}", $email . " ", $message);

            // sendSMS($mobile, $message, $senderId, $campaignId, $userId, 'MTN_BULK');
            if (null == $attachment || '' == $attachment) {
                $isMailDelivered = sendMail($log, $email, $subject, $message, $senderId);
            } else {
                $attachmentPath  = ATTACHMENT_PATH . "$campaignId/" . $attachment;
                $isMailDelivered = sendMailWithAttachment($log, $email, $subject, $message, $senderId, $attachmentPath);
            }

            $log->LogInfo("[CUSTOM EMAIL CAMPAIGN], [CUSTOM], Campaign Id [$campaignId], Campaign Name [$campaignName], Group Id [$groupId], Group Name [$groupName], Mobile [$mobile], Message [$message], SMS Sent");
            $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue("A$count", $contact['first_name'])
                ->setCellValue("B$count", $contact['last_name'])
                ->setCellValue("C$count", $email)
                ->setCellValue("D$count", $mobile)
                ->setCellValue("E$count", $senderId)
                ->setCellValue("F$count", $campaignName)
                ->setCellValue("G$count", 'Sent')
                ->setCellValue("H$count", $message);
            $count = $count + 1;

            //addEmailCampaignReport($userId, $contact['first_name'], $contact['last_name'], $email, $campaignId, $groupName, $isMailDelivered ? EMAIL_DELIVERED : EMAIL_NOT_DELIVERED, $senderId, $templateName, $contact['mobile'], $message, $subject);
            addEmailCampaignReport($userId, $contact['first_name'], $contact['last_name'], $email, $campaignId, $groupName, "3", $senderId, 'N', $contact['mobile'], $message, $subject, $isMailDelivered ? EMAIL_DELIVERED : EMAIL_NOT_DELIVERED);

            $messageId = date('YmdHis') . $userId . $campaignId . time() . rand(1000, 9999);

            insertEmailMessage($userId, $campaignId, $email, $message, $subject, $senderId, $isMailDelivered ? EMAIL_DELIVERED : EMAIL_NOT_DELIVERED);
        }
        $objPHPExcel->getActiveSheet()->setTitle('Campaign Details');
        // Set active sheet index to the first sheet, so Excel opens this as the first sheet
        $objPHPExcel->setActiveSheetIndex(0);
        // Save Excel 2007 file

        $callStartTime = microtime(true);
        $objWriter     = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->save(DEFAULT_DIR . "/$campaignId/$fileName");
    }
}
updateCampaign($campaignId, COMPLETED_STATUS);
$fileUrl = FILEPATH_URL . "/upload/campaign/$campaignId/$fileName";
updateCampaignFileUrl($campaignId, $fileUrl);
$log->LogInfo("[CUSTOM EMAIL CAMPAIGN], [CUSTOM], Campaign Id [$campaignId], Ended");
