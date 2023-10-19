<?php
function connectDB()
{
    $link = mysqli_connect(DB_HOST, DB_USERNAME, DB_PASSWORD);
    if (!$link) {
        die('Could not connect: ' . mysqli_connect_error());
    }
    mysqli_select_db($link, DB_NAME);
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

function messageUpdate($campaignId, $msisdn, $status)
{
    global  $log;
    $link = connectDB();
    $campaignId = mysqli_real_escape_string($link, $campaignId);
    $query = "UPDATE campaign_report set  status='$status',updated_at=now() where  msisdn='$msisdn' and campaign_id='$campaignId' limit 1";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}

function smsReportUpdate($campaignId, $msisdn, $status)
{
    global  $log;
    $link = connectDB();
    $campaignId = mysqli_real_escape_string($link, $campaignId);
    $query = "UPDATE messages_report set  status='$status',updated_at=now() where  msisdn='$msisdn' and campaign_id='$campaignId' limit 1";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}

function campaignDelivered($campaignId)
{
    global  $log;
    $link = connectDB();
    $campaignId = mysqli_real_escape_string($link, $campaignId);
    $query = "UPDATE campaigns set  success=success+1 where  id='$campaignId' limit 1";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}

function insertmessage($campaignOwner, $campaignId, $msisdn, $message, $message_id, $senderId)
{
    global  $log;
    $link = connectDB();
    $campaignId = mysqli_real_escape_string($link, $campaignId);
    $query = "insert into messages_report (user_id, campaign_id, sender_id, content, msisdn, message_id, created_at, updated_at) values('$campaignOwner', '$campaignId', '$message', '$msisdn', '$message_id', now(), now())";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}