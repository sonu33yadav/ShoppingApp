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

if (($open = fopen("Sys Contact List.csv", "r")) !== false) {

    while (($data = fgetcsv($open, 1000, ",")) !== false) {

        $id               = $data[0];
        $pid              = $data[1];
        $phonenumber      = $data[2];
        $email            = $data[3];
        $username         = $data[4];
        $company          = $data[5];
        $fname            = $data[6];
        $lanme            = $data[7];
        if ('ID' == $id) {
            continue;
        }
    
        
        // print_r($data);
            $cGroupData = getId($pid);
            //   print_r($cGroupData[0]['user_id']);die;
            if (false != $cGroupData) {
                $userId = $cGroupData[0]['user_id'];
                $groupId = $cGroupData[0]['id'];
                // print_r($userId);
                // print_r($groupId); die;
                insertContactList($userId,$groupId,$phonenumber,$email,$username,$company,$fname,$lanme);
            }
        
    }
    fclose($open);
}
echo "</pre>";


function getId($pid)
{
    global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME, $log;
    $link  = connectDB();
    $query = "select * from contact_groups where txt_group_id='$pid'";
     // $log->LogInfo("$query");
    $d = getData($query, $link);
    mysqli_close($link);
    if (null != $d) {
        $userId = $d[0];
        //   print_r($userId);die;
        return $d;
    } else {
         return false;
    }
}

function insertContactList($userId,$pid,$phonenumber,$email,$username,$company,$fname,$lanme)
{
    global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME, $log;
    $link      = connectDB();
    $log->LogInfo("HEAR");
    $newmsisdn = substr($phonenumber, -9);
    $phnumber  = "233" . $newmsisdn;
    $fname= mysqli_real_escape_string($link,$fname);
    $lanme= mysqli_real_escape_string($link,$lanme);
    $query     = "insert into contacts(user_id,group_id,first_name,last_name,mobile,email,status) values('$userId', '$pid', '$fname','$lanme','$phnumber','$email','1')";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
        return true;
}

