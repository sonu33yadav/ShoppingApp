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

if (($open = fopen("Sender ID.csv", "r")) !== false) {

    while (($data = fgetcsv($open, 1000, ",")) !== false) {

        $id               = $data[0];
        $senderId         = $data[1];
        $txtId            = $data[2];
        $status           =$data[3];
        $created_at       =$data[4];
        $updated_at       =$data[5];
        $type             =$data[6];
        if ('ID' == $id) {
            continue;
        }
        if($status == 'block')
            continue;
       
        //  print_r($data);die;
        
            
            $userId = getuserId($txtId);
            if (false != $userId) {

                insertsenderid($senderId,$status,$userId,$type,$created_at,$updated_at);
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
    $d = getData($query, $link);
    mysqli_close($link);
    if (null != $d) {
        $userId = $d[0]['id'];
        return $userId;
    } else {
        return false;
    }
}

function insertsenderid($senderId,$status,$userId,$type,$created_at,$updated_at)
{
    global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME, $log;
    $link      = connectDB();
    if($status=="block")
        return false;
    else if($status=="unblock")
        $status = '2';
    else
        $status = '1';

    
    $requestedby=$userId;
    $created_at = date('Y-m-d H:i:s', strtotime($created_at));
    $updated_at = date('Y-m-d H:i:s', strtotime($updated_at));
    $senderId= mysqli_real_escape_string($link,$senderId);
    if($type== "sms"){
    $query     = "insert into managesender_ids (userid,senderid,requestedby,status,created_at,updated_at) values('$userId', '$senderId', '$requestedby', '$status','$created_at','$updated_at')";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
        return true;
    }else if($type== "email"){
         $query     = "insert into emailSenderIds (userid,emailid,requestedby,status,created_at,updated_at) values('$userId', '$senderId',  '$requestedby', '$status','$created_at','$updated_at')";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
        return true;
    }else{
        return true;
    }
}

