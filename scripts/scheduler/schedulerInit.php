<?php
chdir(dirname(__FILE__));
// define('SMS', 1);
// define('VOICE', 2);
// define('EMAIL', 3);
// define('RUNNING_STATUS', 1);
require_once "./KLogger/KLogger.php";
require_once "./helpers/globals.php";
require 'common.php';
$log  = new KLogger("./log/", KLogger::DEBUG);
$type = $argv[1];
$log->LogInfo("Type [$type]");
$getCampaigns = getScheduledCampaigns($type);
if (false != $getCampaigns) {

    foreach ($getCampaigns as $campaign) {
        $campaignId   = $campaign['id'];
        $groupId      = $campaign['group_id'];
        $groupName    = $campaign['group_name'];
        $senderId     = $campaign['sender_id'];
        $message      = $campaign['message'];
        $campaignName = $campaign['name'];
        $contacts     = getGroupContacts($groupId);
        if (false == $contacts) {
            $log->LogInfo("Campaign Id [$campaignId], Campaign Name [$campaignName], groupId [$groupId], groupName [$groupName], No Contacts found");
        } else {
            if (SMS == $campaign['type']) {

                if (0 == $campaign['template_id']) {
                    updateCampaign($campaignId, RUNNING_STATUS);
                    $command = "nohup /usr/bin/php " . PATH . "sms_broadcast_normal.php '$campaignId'>/dev/null 2>&1 & echo $!;";
                    $pid     = exec($command, $output);
                    $log->LogInfo("[Normal], [$type] [OKOKOKO], Campaign Id [$campaignId], Campaign Name [$campaignName], groupId [$groupId], groupName [$groupName], [NORMAL CAMPAIGN], Command [$command]");
                } else {
                    echo "Custom Campaign";
                    updateCampaign($campaignId, RUNNING_STATUS);
                    $command = "nohup /usr/bin/php " . PATH . "sms_broadcast_custom.php '$campaignId'>/dev/null 2>&1 & echo $!;";
                    $pid     = exec($command, $output);
                    $log->LogInfo("[Custom], [$type] Campaign Id [$campaignId], Campaign Name [$campaignName], groupId [$groupId], groupName [$groupName], [CUSTOM CAMPAIGN], Command [$command]");
                }
            }
        }
    }

} else {
    $log->LogInfo("Nothing scheduled");
}
