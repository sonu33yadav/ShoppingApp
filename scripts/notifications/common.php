<?php
require_once "./helpers/globals.php";
define("DB_HOST", "localhost");
define("DB_NAME", "txtconnect");
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
// function getPaymentsDataFor10PercentNew($type)
// {
//     $link = connectDB();
//     if ('SMS' == $type) {
//         $query = "select U.email, U.name, U.phone, C.sms as sms_remaining, C.email as email_remaining, C.voice as voice_remaining, C.sms_total as sms_quantity, C.email_total as email_quantity, C.voice_total as voice_quantity, C.email_notify, C.sms_notify, C.voice_notify from account_credits as C INNER JOIN users as U ON U.id=C.user_id where order by C.id desc";
//     }
//     $query = "select U.email, U.name, U.phone, C.sms as sms_remaining, C.email as email_remaining, C.voice as voice_remaining, C.sms_total as sms_purchased, C.email_total as email_purchased, C.voice_total as voice_purchased, C.email_notify, C.sms_notify, C.voice_notify from account_credits as C INNER JOIN users as U ON U.id=C.user_id order by C.id desc";
//     $d = getData($query, $link);
//     mysqli_close($link);
//     if (null != $d) {
//         return $d;
//     } else {
//         return false;
//     }
// }

function getPaymentsDataFor10Percent()
{
    $link = connectDB();
    $query = "select P.id, P.user_id, P.notify, P.notify_date, U.phone, U.name, U.email, P.sms_quantity, C.sms as sms_remaining, P.email_quantity, C.email as email_remaining, P.voice_quantity, C.voice as voice_remaining from payments as P INNER JOIN account_credits as C ON C.user_id=P.user_id INNER JOIN users as U ON U.id=P.user_id where P.notify=0 AND P.status =2 order by P.id desc";
    $d = getData($query, $link);
    mysqli_close($link);
    if (null != $d) {
        return $d;
    } else {
        return false;
    }
}

function getPaymentsDataFor2Percent()
{
    $link = connectDB();
    $query = "select P.id, P.user_id, P.notify, P.notify_date, U.phone, U.name, U.email, P.sms_quantity, C.sms as sms_remaining, P.email_quantity, C.email as email_remaining, P.voice_quantity, C.voice as voice_remaining from payments as P INNER JOIN account_credits as C ON C.user_id=P.user_id INNER JOIN users as U ON U.id=P.user_id where P.notify=1 AND P.status =2 and date(P.notify_date) != curdate() order by P.id desc";
    $d = getData($query, $link);
    mysqli_close($link);
    if (null != $d) {
        return $d;
    } else {
        return false;
    }
}

function updatePaymentNotification($id)
{
    $link = connectDB();
    $id = mysqli_real_escape_string($link, $id);
    $query = "UPDATE payments set notify=notify+1, notify_date=now()  where id=$id";
    mysqli_query($link, $query);
    mysqli_close($link);
    return true;
}
