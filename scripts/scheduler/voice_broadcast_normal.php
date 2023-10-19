<?php
chdir(dirname(__FILE__));
require_once './PHPExcel-1.8/Classes/PHPExcel.php';
require_once "./KLogger/KLogger.php";
require_once "./helpers/globals.php";
require 'common.php';
$log = new KLogger("./log_voice_normal/", KLogger::DEBUG);
$campaignId = $argv[1];
$campaignDetails = getSingleVoiceCampaign($campaignId);

$fileName = $campaignId . ".xls";
if (false == $campaignDetails) {
    $log->LogInfo("[VOICE CAMPAIGN], [NORMAL], Campaign Id [$campaignId]");
} else {

    $groupId = $campaignDetails['group_id'];
    $userId = $campaignDetails['user_id'];
    $groupName = $campaignDetails['group_name'];
    $callerId = $campaignDetails['sender_id'];
    $message = $campaignDetails['message'];
    $campaignName = $campaignDetails['name'];
    $contacts = getGroupContacts($groupId);
    $numberOfContacts = count($contacts);
    //Heading
    //Heading
    mkdir(DEFAULT_DIR . "/$campaignId");
    if (false == $contacts) {
        $log->LogInfo("[VOICE CAMPAIGN], [NORMAL], User Id [$userId], Campaign Id [$campaignId], Campaign Name [$campaignName], Group Id [$groupId], Group Name [$groupName],  No Contacts Found");
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
            ->setCellValue("E$count", 'Caller Id')
            ->setCellValue("F$count", 'Campaign Name')
            ->setCellValue("G$count", 'Status')
            ->setCellValue("H$count", 'File Name');
        $log->LogInfo("[VOICE CAMPAIGN], [NORMAL], User Id [$userId], Campaign Id [$campaignId], Campaign Name [$campaignName], Group Id [$groupId], Group Name [$groupName], Broadcast count [$numberOfContacts], Message [$message]");
        $count = $count + 1;
        foreach ($contacts as $contact) {
            $mobile = $contact['mobile'];
            if (strlen($mobile) != 12) {
                continue;
            }

            $log->LogInfo("[VOICE CAMPAIGN], [NORMAL], User Id [$userId], Campaign Id [$campaignId], Campaign Name [$campaignName], Group Id [$groupId], Group Name [$groupName], Mobile [$mobile], VOICE Sent");

            // sendSMS($mobile, $message, $callerId, $campaignId, $userId, 'MTN_BULK');

            $audioFileName = explode("/", $message);
            $audioFileName = $audioFileName[count($audioFileName) - 1];

            $audioFileNameWithoutExt = explode(".wav", $audioFileName);
            $audioFileNameWithoutExt = $audioFileNameWithoutExt[0];

            // $audioFilePath = "/var/www/html/PROJECTS/TxtGhana/Txtconnect/txtconnect-node-backend/users/upload/voice/$audioFileName";
            // $destinationFilePath = AUDIO_COPY_PATH . "/{$audioFileName}";
            // exec("cp $audioFilePath $destinationFilePath");

            $uploadPath = "../../users/upload/calls";
            $command = "find $uploadPath/ -maxdepth 1 -type f -name *.call | wc -l";

            $fileCount = exec($command);
            $fileCount = trim($fileCount);
            $fileCount = (int) $fileCount;

            $log->LogInfo("[VOICE CAMPAIGN], [NORMAL], Current File Count [$fileCount], Max Limit [" . CALL_LIMIT . "]");

            while ($fileCount > CALL_LIMIT) {
                $log->LogInfo(
                    `--------------------THE LOOP IS PAUSED---------------------------`
                );
                sleep(CALL_PAUSE_TIME);

                $log->LogInfo(
                    `--------------------THE LOOP STARTS AGAIN---------------------------`
                );

                $fileCount = exec($command);
                $fileCount = trim($fileCount);
                $fileCount = (int) $fileCount;

                $log->LogInfo(
                    `[VOICE CAMPAIGN], [NORMAL], Rechecked Current File Count [$fileCount]`
                );
            }
            ;

            $nameFrom = '+' . $callerId . ' +' . $mobile . ' ' . '1';

            $obdString = "Channel: sip/+$mobile@" . MSC_IP . ":" . MSC_PORT . "\nCallerID: $nameFrom<+$callerId>\nExtension:s\nContext:playprompt\nMaxRetries: 0\nRetryTime:0\nWaitTime:" . MSC_WAIT_TIME . "\nPriority:2\nSet: filename=" . ASTERIK_AUDIO_PATH . "/$campaignId/$audioFileNameWithoutExt";

            $path = "$uploadPath/$mobile.call";
            $log->LogInfo(`[VOICE CAMPAIGN], [NORMAL], [Call PATH], [$path] `);
            $callFile = fopen($path, "w");
            fwrite($callFile, $obdString);
            fclose($callFile);

            $log->LogInfo(
                `[VOICE CAMPAIGN], [NORMAL], [Call File Created Successfully], File Name [$mobile.call] `
            );

            $newPath = ASTERIK_PATH . "/$mobile.call";

            $moveCommand = "mv $path $newPath";
            exec($moveCommand);
            // rename($path, $newPath);
            $log->LogInfo(
                `[VOICE CAMPAIGN], [NORMAL], [Call File Moved Successfully], File Name [$mobile.call] `
            );

            $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue("A$count", $contact['first_name'])
                ->setCellValue("B$count", $contact['last_name'])
                ->setCellValue("C$count", $contact['email'])
                ->setCellValue("D$count", $mobile)
                ->setCellValue("E$count", $callerId)
                ->setCellValue("F$count", $campaignName)
                ->setCellValue("G$count", 'Sent')
                ->setCellValue("H$count", $audioFileName);
            $count = $count + 1;
            $messageId = date('YmdHis') . $userId . $campaignId . time() . rand(1000, 9999);
            // insertMessage($userId, $campaignId, $mobile, $message, $messageId, $callerId);
            addVoiceCampaignReport($userId, $contact['first_name'], $contact['last_name'], $contact['email'], $campaignId, $groupName, '2', $callerId, $mobile, $message, '1');

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

$log->LogInfo("[VOICE CAMPAIGN], [NORMAL], Campaign Id [$campaignId], Ended");
