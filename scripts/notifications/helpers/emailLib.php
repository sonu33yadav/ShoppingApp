<?php
// use ../Phpmailer_lib.php;
use PHPMailer\PHPMailer\PHPMailer;
require_once "vendor/autoload.php";
// require_once "../KLogger/KLogger.php";
//require_once "globals.php";
// require 'Phpmailer_lib.php';
// $log = new KLogger("../log_email_normal/", KLogger::DEBUG);
// $log2 = new KLogger("../log_email_custom/", KLogger::DEBUG);
function sendMail($email, $message, $subject)
{
    global $log;
    $log->LogInfo("[mail], email [$email], $subject,$message");

    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->SMTPDebug = 2;
    $mail->Host = MAIL_HOST;
    // $mail->SMTPAuth = MAIL_SECURE;
    $mail->Port = MAIL_PORT;
    $mail->IsHTML(true);
    // $mail->Username = MAIL_FROM_ADDRESS;
    // $mail->Password = MAIL_PASSWORD;
    $mail->setFrom(MAIL_FROM_ADDRESS);
    $mail->addAddress($email);
    $mail->Subject = $subject;
    // $content = $message;
    $mail->MsgHTML($message);
    $mail->Body = $message;
    $mail->send();
    if (!$mail->send()) {
        $log->LogInfo("[mail], Mail Error [" . print_r($mail, true));
        return false;
    } else {
        return true;
    }
}
