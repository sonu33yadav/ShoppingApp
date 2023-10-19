<?php
chdir(dirname(__FILE__));
require_once './PHPExcel-1.8/Classes/PHPExcel.php';
require_once "./KLogger/KLogger.php";
require_once "./helpers/globals.php";
require_once "./helpers/emailLib.php";
require 'common.php';
$log = new KLogger("./log_email_normal/", KLogger::DEBUG);
$campaignId = $argv[1];
$campaignDetails = getSingleEmailCampaign($campaignId);

$fileName = $campaignId . ".xls";
if (false == $campaignDetails) {
    $log->LogInfo("[EMAIL CAMPAIGN], [NORMAL], Campaign Id [$campaignId]");
} else {

    $groupId = $campaignDetails['group_id'];
    $userId = $campaignDetails['user_id'];
    $groupName = $campaignDetails['group_name'];
    $senderId = $campaignDetails['sender_id'];
    $message = $campaignDetails['message'];
    $campaignName = $campaignDetails['name'];
    $subject = $campaignDetails['subject'];
    $attachment = $campaignDetails['attachment'];
    $contacts = getGroupContacts($groupId);
    $numberOfContacts = count($contacts);
    //Heading
    //Heading
    mkdir(DEFAULT_DIR . "/$campaignId");
    if (false == $contacts) {
        $log->LogInfo("[EMAIL CAMPAIGN], [NORMAL], User Id [$userId], Campaign Id [$campaignId], Campaign Name [$campaignName], Group Id [$groupId], Group Name [$groupName],  No Contacts Found");
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
            ->setCellValue("i$count", 'subject');
        $log->LogInfo("[EMail CAMPAIGN], [NORMAL], User Id [$userId], Campaign Id [$campaignId], Campaign Name [$campaignName], Group Id [$groupId], Group Name [$groupName], Broadcast count [$numberOfContacts], Message [$message],Subject[$subject]");
        $count = $count + 1;
        foreach ($contacts as $contact) {
            $email = $contact['email'];
            if (strlen($email) < 2) {
                continue;
            }

            $log->LogInfo("[Email CAMPAIGN], [NORMAL], User Id [$userId], Campaign Id [$campaignId], Campaign Name [$campaignName], Group Id [$groupId], Group Name [$groupName], Email [$email], Email Sent");

            // sendSMS($mobile, $message, $senderId, $campaignId, $userId, 'MTN_BULK');
            if (null == $attachment || '' == $attachment) {
                $isMailDelivered = sendMail($log, $email, $subject, $message, $senderId);
            } else {
                $attachmentPath = ATTACHMENT_PATH . $campaignId . "/" . $attachment;
                echo "Attachment - $attachmentPath\n" .
                $isMailDelivered = sendMailWithAttachment($log, $email, $subject, $message, $senderId, $attachmentPath);
            }
            $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue("A$count", $contact['first_name'])
                ->setCellValue("B$count", $contact['last_name'])
                ->setCellValue("C$count", $contact['mobile'])
                ->setCellValue("D$count", $email)
                ->setCellValue("E$count", $senderId)
                ->setCellValue("F$count", $campaignName)
                ->setCellValue("G$count", 'Sent')
                ->setCellValue("H$count", $message)
                ->setCellValue("i$count", $subject);
            $count = $count + 1;
            // $messageId = date('YmdHis') . $userId . $campaignId . time() . rand(1000, 9999);
            insertEmailMessage($userId, $campaignId, $email, $message, $subject, $senderId, $isMailDelivered ? EMAIL_DELIVERED : EMAIL_NOT_DELIVERED);
            //    $log->LogInfo("[EMAIL CAMPAIGN], [NORMAL], Campaign Id  Email inserted");
            addEmailCampaignReport($userId, $contact['first_name'], $contact['last_name'], $email, $campaignId, $groupName, "3", $senderId, 'N', $contact['mobile'], $message, $subject, $isMailDelivered ? EMAIL_DELIVERED : EMAIL_NOT_DELIVERED);
        }
        $objPHPExcel->getActiveSheet()->setTitle('Campaign Details');
        $objPHPExcel->setActiveSheetIndex(0);
        // Save Excel 2007 file

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->save(DEFAULT_DIR . "/$campaignId/$fileName");
    }
}

$fileUrl = FILEPATH_URL . "/upload/campaign/$campaignId/$fileName";
updateCampaign($campaignId, COMPLETED_STATUS);
updateCampaignFileUrl($campaignId, $fileUrl);

$log->LogInfo("[EMAIL CAMPAIGN], [NORMAL], Campaign Id [$campaignId], Ended");
