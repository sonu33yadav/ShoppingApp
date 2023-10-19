<?php
require_once "../../KLogger/KLogger.php";

function connectDB()
{
    // TS DEV
    $DB_HOST     = "localhost";
    $DB_NAME     = 'testingtxtconnect';
    $DB_USERNAME = 'rapidtest';
    $DB_PASSWORD = "rapidtest#321";

    // TXT

    // $DB_HOST = "62.129.149.141";
    // $DB_NAME = 'mtninfobox';
    // $DB_USERNAME = 'blastuser';
    // $DB_PASSWORD = "blastapp#2219";

    //global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME;
    $link = mysqli_connect($DB_HOST, $DB_USERNAME, $DB_PASSWORD);
    if (!$link) {
        die('Could not connect: ' . mysqli_connect_error());
    }
    mysqli_select_db($link, $DB_NAME);
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

$log = new KLogger("./log/", KLogger::DEBUG);
$log->LogInfo("[REQ], " . print_r($_GET, true));

if (($open = fopen("Sys Import Phone Number.csv", "r")) !== false) {

    while (($data = fgetcsv($open, 1000, ",")) !== false) {

        $id               = $data[0];
        $txtId            = $data[1];
        $groupName           =$data[2];
        if ('ID' == $id) {
            continue;
        }
        $userId = getuserId($txtId);
        if (false != $userId) {
            addContactGroup($groupName,$userId, $id);
        }
        
    }
    fclose($open);
}
echo "</pre>";

function getuserId($txtId)
{
    global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME, $log;
    $link  = connectDB();
    $query = "select id from users where txtid='$txtId'";
    // $log->LogInfo("$query");
    $d = getData($query, $link);
    mysqli_close($link);
    if (null != $d) {
        $userId = $d[0]['id'];
        return $userId;
    } else {
        return false;
    }
}

function addContactGroup($groupName,$userId, $txt_group_id)
{
    global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME, $log;
    $link      = connectDB();
    $groupName= mysqli_real_escape_string($link,$groupName);
    
    $query     = "insert into contact_groups (user_id,name,status, txt_group_id, created_at, updated_at) values('$userId', '$groupName',  '2', '$txt_group_id', now(), now())";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}

