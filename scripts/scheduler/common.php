<?php
require_once "./helpers/globals.php";

define("DB_HOST", "localhost");
define("DB_NAME", "paygo_sms_portal");
//define("DB_NAME", "testingtxtconnect");
define('SMS', 1);
define('VOICE', 2);
define('EMAIL', 3);
define('RUNNING_STATUS', 1);
define('COMPLETED_STATUS', 2);

function connectDB()
{
    $link = mysqli_connect(DB_HOST, DB_USERNAME, DB_PASSWORD);
    if (!$link) {
        die('Could not connect: ' . mysqli_connect_error());
    }
    mysqli_select_db($link, DB_NAME);
    return $link;
}

function connectKannelDB()
{
    $link = mysqli_connect(DB2_HOST, DB2_USERNAME, DB2_PASSWORD);
    if (!$link) {
        die('Could not connect: ' . mysqli_connect_error());
    }
    mysqli_select_db($link, DB2_NAME);
    return $link;
}

function getData($query, $link)
{
    $result = mysqli_query($link, $query);
    if ($result) {
        $rows = mysqli_num_rows($result);
        if ($rows > 0) {
            while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
                $data[] = $row;
            }
            return $data;
        } else {
            return null;
        }

    } else {
        return null;
    }
}

function getScheduledCampaigns($type = 'SMS')
{
    $link = connectDB();

    $query = "select c.user_id, c.id, c.group_id, cg.name as group_name, c.name, c.message, c.total, c.type, s.sender_id as sender_id, template_id, schedule from campaigns as c INNER JOIN sender_id as s ON s.id=c.sender_id INNER JOIN contact_groups as cg on cg.id=c.group_id where schedule <= now() and c.is_scheduled =1 and c.status=1 ";

    $d = getData($query, $link);
    mysqli_close($link);
    if (null != $d) {
        return $d;
    } else {
        return false;
    }
}

//added only c.subject in this function
function getSingleCampaign($id)
{
    $link = connectDB();
    $id = mysqli_real_escape_string($link, $id);
    $query = "select c.user_id, c.id, c.group_id, cg.name as group_name, c.name, c.message, c.total, c.type,c.subject, s.sender_id as sender_id, template_id, schedule, attachment from campaigns as c INNER JOIN sender_id as s ON s.id=c.sender_id INNER JOIN contact_groups as cg on cg.id=c.group_id  where c.id=$id";
    $d = getData($query, $link);
    mysqli_close($link);
    if (null != $d) {
        return $d[0];
    } else {
        return false;
    }
}

//the is crreated for email campign
// function getSingleEmailCampaign($id)
// {
//     $link = connectDB();
//     $id = mysqli_real_escape_string($link, $id);
//     $query = "select c.user_id, c.id, c.group_id, cg.name as group_name, c.name, c.message, c.total, c.type,c.subject, s.emailid as sender_id, template_id, schedule, attachment from campaigns as c INNER JOIN emailSenderIds as s ON s.id=c.sender_id INNER JOIN contact_groups as cg on cg.id=c.group_id  where c.id=$id";
//     $d = getData($query, $link);
//     mysqli_close($link);
//     if (null != $d) {
//         return $d[0];
//     } else {
//         return false;
//     }
// }

// //the is crreated for voice campign
// function getSingleVoiceCampaign($id)
// {
//     $link = connectDB();
//     $id = mysqli_real_escape_string($link, $id);
//     $query = "select c.user_id, c.id, c.group_id, cg.name as group_name, c.name, c.message, c.total, c.type,c.subject, s.callerid as sender_id, template_id, schedule from campaigns as c INNER JOIN caller_ids as s ON s.id=c.sender_id INNER JOIN contact_groups as cg on cg.id=c.group_id  where c.id=$id";
//     $d = getData($query, $link);
//     mysqli_close($link);
//     if (null != $d) {
//         return $d[0];
//     } else {
//         return false;
//     }
// }

function getSingleTemplate($id)
{
    $link = connectDB();
    $id = mysqli_real_escape_string($link, $id);
    $query = "select id, name, data from sms_templates where  id = $id";
    $d = getData($query, $link);
    mysqli_close($link);
    if (null != $d) {
        return $d[0];
    } else {
        return false;
    }
}

function getGroupContacts($id)
{
    $link = connectDB();
    $id = mysqli_real_escape_string($link, $id);
    $query = "select first_name, last_name, mobile, email  from contacts where group_id=$id";
    $d = getData($query, $link);
    mysqli_close($link);
    if (null != $d) {
        return $d;
    } else {
        return false;
    }
}

function updateCampaignSuccessCount($count, $campaignId)
{
    $link = connectDB();
    $campaignId = mysqli_real_escape_string($link, $campaignId);
    $count = mysqli_real_escape_string($link, $count);
    $query = "UPDATE campaigns set success=$count,total=$count, balance_consumed=$count  where id=$campaignId";
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}
function updatemessageId($messageId, $campaignId, $mobile)
{
    //global $log;
    $link = connectDB();
    $messageId = mysqli_real_escape_string($link, $messageId);
    $campaignId = mysqli_real_escape_string($link, $campaignId);
    $count = mysqli_real_escape_string($link, $mobile);
    $query = "UPDATE campaigns_report set message_id=$messageId where campaign_id=$campaignId and msisdn=$mobile";
    //$log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}
function updateCampaign($campaignId, $status)
{
    $link = connectDB();
    $campaignId = mysqli_real_escape_string($link, $campaignId);
    $status = mysqli_real_escape_string($link, $status);
    $query = "UPDATE campaigns set status='$status'  where id=$campaignId";
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}

function updateCampaignFileUrl($campaignId, $url)
{
    $link = connectDB();
    $campaignId = mysqli_real_escape_string($link, $campaignId);
    $fileUrl = mysqli_real_escape_string($link, $url);
    $query = "UPDATE campaigns set file_name='$fileUrl'  where id=$campaignId";
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;

}

function addCampaignReport($userId, $firstName, $lastName, $email, $campaignId, $groupName, $type, $senderId, $template, $msisdn, $content, $status)
{
    //global $log;
    $link = connectDB();
    $userId = mysqli_real_escape_string($link, $userId);
    $firstName = mysqli_real_escape_string($link, $firstName);
    $lastName = mysqli_real_escape_string($link, $lastName);
    //$email      = mysqli_real_escape_string($link, $email);
    $campaignId = mysqli_real_escape_string($link, $campaignId);
    $groupName = mysqli_real_escape_string($link, $groupName);
    $type = mysqli_real_escape_string($link, $type);
    $senderId = mysqli_real_escape_string($link, $senderId);
    $template = mysqli_real_escape_string($link, $template);
    $msisdn = mysqli_real_escape_string($link, $msisdn);
    $content = mysqli_real_escape_string($link, $content);
    $status = mysqli_real_escape_string($link, $status);
    $query = "INSERT INTO campaigns_report(user_id, first_name, last_name, campaign_id, contact_group, type, sender_id, template, msisdn, content,status, created_at, updated_at)VALUES('$userId', '$firstName', '$lastName', '$campaignId', '$groupName', '$type', '$senderId', '$template', '$msisdn', '$content','$status', NOW(), NOW())";
    //$log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}

function addVoiceCampaignReport($userId, $firstName, $lastName, $email, $campaignId, $groupName, $type, $caller_id, $msisdn, $content, $status)
{
    $link = connectDB();
    $userId = mysqli_real_escape_string($link, $userId);
    $firstName = mysqli_real_escape_string($link, $firstName);
    $lastName = mysqli_real_escape_string($link, $lastName);
    $email = mysqli_real_escape_string($link, $email);
    $campaignId = mysqli_real_escape_string($link, $campaignId);
    $groupName = mysqli_real_escape_string($link, $groupName);
    $type = mysqli_real_escape_string($link, $type);
    $caller_id = mysqli_real_escape_string($link, $caller_id);
    $msisdn = mysqli_real_escape_string($link, $msisdn);
    $content = mysqli_real_escape_string($link, $content);
    $status = mysqli_real_escape_string($link, $status);
    $query = "Insert into campaign_voice_report  (user_id, first_name, last_name, email, campaign_id, group_name, type, caller_id,  msisdn, filepath, status, created_at) values('$userId', '$firstName', '$lastName', '$email', '$campaignId', '$groupName', '$type', '$caller_id', '$msisdn', '$content', '$status' ,now());";
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}

function insertMessage($campaignOwner, $campaignId, $msisdn, $message, $messageId, $senderId)
{
    global $BLAST_DB_HOST, $BLAST_DB_USERNAME, $BLAST_DB_PASSWORD, $BLAST_DB_NAME, $log;
    $link = connectDB();
    $campaignOwner = mysqli_real_escape_string($link, $campaignOwner);
    $campaignId = mysqli_real_escape_string($link, $campaignId);
    $msisdn = mysqli_real_escape_string($link, $msisdn);
    $message = mysqli_real_escape_string($link, $message);
    $messageId = mysqli_real_escape_string($link, $messageId);
    $senderId = mysqli_real_escape_string($link, $senderId);
    $query = "insert into messages_report (user_id, campaign_id, sender_id, content, msisdn, message_id, created_at, updated_at) values('$campaignOwner', '$campaignId','$senderId', '$message', '$msisdn', '$messageId', now(), now())";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}
//new Fnnction added for email
function insertEmailMessage($userId, $campaignId, $email, $message, $subject, $senderId, $status)
{
    global $BLAST_DB_HOST, $BLAST_DB_USERNAME, $BLAST_DB_PASSWORD, $BLAST_DB_NAME, $log;
    $link = connectDB();
    $campaignOwner = mysqli_real_escape_string($link, $userId);
    $campaignId = mysqli_real_escape_string($link, $campaignId);
    $email = mysqli_real_escape_string($link, $email);
    $message = mysqli_real_escape_string($link, $message);
    $subject = mysqli_real_escape_string($link, $subject);
    $senderId = mysqli_real_escape_string($link, $senderId);
    $status = mysqli_real_escape_string($link, $status);
    $query = "insert into combine_email_reports (user_id, campaign_id, email_sender_id,email,subject, content, created_at, updated_at, status) values('$campaignOwner', '$campaignId','$senderId', '$email','$subject','$message',  now(), now(), '$status')";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}
//Function new added for email
function addEmailCampaignReport($userId, $firstName, $lastName, $email, $campaignId, $groupName, $type, $senderId, $template, $msisdn, $content, $subject, $status)
{
    $link = connectDB();
    $userId = mysqli_real_escape_string($link, $userId);
    $firstName = mysqli_real_escape_string($link, $firstName);
    $lastName = mysqli_real_escape_string($link, $lastName);
    $email = mysqli_real_escape_string($link, $email);
    $campaignId = mysqli_real_escape_string($link, $campaignId);
    $groupName = mysqli_real_escape_string($link, $groupName);
    $type = mysqli_real_escape_string($link, $type);
    $senderId = mysqli_real_escape_string($link, $senderId);
    $template = mysqli_real_escape_string($link, $template);
    $msisdn = mysqli_real_escape_string($link, $msisdn);
    $content = mysqli_real_escape_string($link, $content);
    $subject = mysqli_real_escape_string($link, $subject);
    $status = mysqli_real_escape_string($link, $status);
    $query = "Insert into campaign_email_report(user_id, first_name, last_name, email, campaign_id, group_name, type, email_Sender_id, template, msisdn, content, subject, created_at, updated_at, status) values('$userId', '$firstName', '$lastName', '$email', '$campaignId', '$groupName', '$type', '$senderId', '$template', '$msisdn', '$content','$subject', now(), now(), '$status');";
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}

function insertKannelDB($senderId, $msisdn, $content, $smsc, $dlrURL, $campaignId)
{
    $link = connectKannelDB();
    $senderId = mysqli_real_escape_string($link, $senderId);
    $msisdn = mysqli_real_escape_string($link, $msisdn);
    $content = mysqli_real_escape_string($link, $content);
    $smsc = mysqli_real_escape_string($link, $smsc);
    $dlrURL = mysqli_real_escape_string($link, $dlrURL);
    $campaignId = mysqli_real_escape_string($link, $campaignId);
    $content = urlencode($content);
    $query = "INSERT INTO `send_sms` (`momt`,`sender`,`receiver`,`msgdata`,`smsc_id`,`service`,`account`,`sms_type`,`coding`,`dlr_mask`,`dlr_url`,`boxc_id`,`foreign_id`,`ddate`, `charset`) VALUES ('MT','$senderId','$msisdn','$content','$smsc','txtgh_url','txtghbulk','2','2','31','$dlrURL','mysmsbox1','$campaignId',NOW(), 'UTF-8')";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}
