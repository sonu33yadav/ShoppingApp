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
if (($openFinal = fopen("sys_clent_final.csv", "r")) !== false) {
    while (($dataFinal = fgetcsv($openFinal, 1000, ",")) !== false) {
        $finalEmail = $dataFinal[4];
        $finalSMS = $dataFinal[7];
        if (($open = fopen("Sys Clients - Users.csv", "r")) !== false) {

            while (($data = fgetcsv($open, 1000, ",")) !== false) {
                $email            = $data[7];
                if($email != $finalEmail)
                    continue;
                $id               = $data[0];
                //$email            = $data[7];
                $password         = $data[9];
                $fname            =$data[3];
                $lname            =$data[4];
                $msisdn           = $data[16];
                $subscriptiondate = $data[18];
                $status           = $data[23];
                $country         = $data[15];
                //$smsLimit       = $data[19];
                $smsLimit       = $finalSMS;
                $apikey       = $data[21];
                if ('ID' == $id) {
                    continue;
                }
                
                // print_r($data);die;
                    $uId = dupicateEmail($email, $msisdn);
                
                    if (false == $uId) {
                        insertUser($email,$password,$fname,$lname,$msisdn,$status,$apikey,$country,$smsLimit,$subscriptiondate,$id);
                        break;
                    }else{
                        //updateUserDetail($fname,$lname,$country,$subscriptiondate,$uId);
                        
                        UpdateMessageCredits($uId,$smsLimit);
                        apiKeyChech($apikey,$uId);
                        break;
                    }
                
            }
            fclose($open);
        }
    }
    fclose($openFinal);
}
echo "</pre>";


function dupicateEmail($email, $msisdn)
{
    global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME, $log;
    $link  = connectDB();
    $email= mysqli_real_escape_string($link,$email);
    $query = "select id from users where email='$email'";
    $d = getData($query, $link);
    mysqli_close($link);
    if (null == $d) {
       
        return false;
    } else {
        
        $uId=$d[0]['id'];
        return $uId;
    }
}
function apiKeyChech($apikey,$uId)
{
    global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME, $log;
    $link  = connectDB();
    $query = "select * from api_keys where user_id='$uId'";
    $d = getData($query, $link);
    mysqli_close($link);
    if (null == $d) {
        return false;
    } else {
        $Kid=$d[0]['id'];
        UpdateApiKey($Kid,$apikey);
        return true;
    }
}

function insertUser($email,$password,$fname,$lname,$msisdn,$status,$apikey,$country,$smsLimit,$subscriptiondate,$id)
{
    global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME, $log;
    $link      = connectDB();
    $newmsisdn = substr($msisdn, -9);
    $phnumber  = "233" . $newmsisdn;
    $name = $fname . $lname;
    if($status== "Active"){
        $newstatus=1;
    }else{
     $newstatus=2;
    }

    if($apikey=='empty'){
        $str_result = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        $apikey      = substr(str_shuffle($str_result), 0, $length_of_string);
    }else{
        $apikey=$apikey;
    }
    $permission='USDB,USSI,USC,CON,USRP,SMST,PLN,APIK,USCI,USESI';
    $name= mysqli_real_escape_string($link,$name);
    $passwordd= mysqli_real_escape_string($link,$password);
    $apikey= mysqli_real_escape_string($link,$apikey);
    $email= mysqli_real_escape_string($link,$email);
    $permission= mysqli_real_escape_string($link,$permission);
    $query     = "insert into users (name,email,phone,password,state,status,type,identity_token,country,permissions,created_at,txtid, updated_at) values('$name', '$email', '$phnumber', '$passwordd','1', '$newstatus','5','$apikey', '$country','$permission','$subscriptiondate','$id', now())";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    $last_id = mysqli_insert_id($link);
    mysqli_close($link);
    if (null != $last_id) {
        messagecredit($last_id,$smsLimit);
        apiKey($last_id,$apikey);
    } else {
        return false;
    }
    return true;
}

function messagecredit($last_id,$smsLimit)
{
    global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME, $log;
    $link  = connectDB();
    $query = "insert into account_credits (user_id, sms,email,voice)values('$last_id','$smsLimit','0','0')";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}

function apiKey($last_id,$apikey)
{
    global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME, $log;
    $link  = connectDB();
    $apikey= mysqli_real_escape_string($link,$apikey);
    $query = "insert into api_keys (user_id , `key` , type)values('$last_id','$apikey','1')";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}

function updateUserDetail($fname,$lname,$country,$subscriptiondate,$smsLimit,$apikey,$uId)
{
    global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME, $log;
    $link  = connectDB();
    $apikey= mysqli_real_escape_string($link,$apikey);
    $name = $fname . $lname;
    $query = "UPDATE users set name='$name', country='$country',  where id=$uId";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    // $last_id = mysqli_insert_id($link);
    mysqli_close($link);
        UpdateMessageCredits($uId,$smsLimit);
    return true;
}

function UpdateMessageCredits($uId,$smsLimit)
{
  global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME, $log;
    $link  = connectDB();
    $query = "UPDATE account_credits set sms='$smsLimit', email='0',voice='0'  where user_id=$uId";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;  
    return true;  
}
function UpdateApiKey($Kid,$apikey)
{
  global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME, $log;
    $link  = connectDB();
    $query = "UPDATE api_keys set `key`='$apikey' where id=$Kid";
    $log->LogInfo("$query");
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;  
}


 function random_strings($length_of_string)
    {
     global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME, $log;
    $link  = connectDB();
        $str_result = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        $tokne      = substr(str_shuffle($str_result), 0, $length_of_string);
        $identity   = User::where('identity_token', $tokne)->first();
        if ($identity == null) {
            return $tokne;
        } else {
            return self::random_strings($length_of_string);
        }
        return $token;
    }
    

