<?php
require_once "./helpers/KLogger/KLogger.php";
include "./helpers/globals.php";
include "./helpers/smsLib.php";
include "./helpers/emailLib.php";
include "./common.php";
$log = new KLogger("./log_10/", KLogger::DEBUG);
$paymentData = getPaymentsDataFor10Percent();
if (false == $paymentData) {
    $log->LogInfo("[PAYMENT 10], No payments found for notification");
    exit();
}
foreach ($paymentData as $payment) {
    $phone = $payment['phone'];
    $email = $payment['email'];
    $smsPurchased = $payment['sms_quantity'];
    $smsBal = $payment['sms_remaining'];
    $emailPurchased = $payment['email_quantity'];
    $emailBal = $payment['email_remaining'];
    $voicePurchased = $payment['voice_quantity'];
    $voiceBal = $payment['voice_remaining'];
    $notifyCount = $payment['notify'];
    $userName = $payment['name'];
    $id = $payment['id'];

    $smsAlert = $emailAlert = $voiceAlert = 0;
    $smsPercent = $emailPercent = $voicePercent = "NA";
    //sms notify
    if ($emailPurchased > 0) {
        $smsPercent = ceil(($smsBal / $smsPurchased) * 100);
        if ($smsPercent < 11) {
            $smsAlert = 1;
        }

    }
    //Email Notify
    if ($emailPurchased > 0) {
        $emailPercent = ceil(($emailBal / $emailPurchased) * 100);
        if ($emailPercent < 11) {
            $emailAlert = 1;
        }
    }
    //Voice Notify
    if ($voicePurchased > 0) {
        $voicePercent = ceil(($voiceBal / $voicePurchased) * 100);
        if ($voicePercent < 11) {
            $voiceAlert = 1;
        }
    }
    if (0 == $smsAlert && 0 == $emailAlert && 0 == $voiceAlert) {
        $log->LogInfo("[PAYMENT 10], Payment ID [$id], Email [$email], Phone [$phone], Name [$userName], Purchased SMS [$smsPurchased], Remaining SMS [$smsBal], Remaining SMS % [$smsPercent], Purchased Email [$emailPurchased], Remaining Email [$emailBal], Remaining Email  % [$emailPercent], Purchased Voice [$voicePurchased], Remaining Voice[$voiceBal], Remaining Voice % [$voicePercent], Sms Bal Low [$smsAlert], Email Bal Low [$emailAlert], Voice Bal Low [$voiceAlert] Balance ok");
        continue;
    } else {
        $log->LogInfo("[PAYMENT 02], Payment ID [$id], Email [$email], Phone [$phone], Name [$userName], Purchased SMS [$smsPurchased], Remaining SMS [$smsBal], Remaining SMS % [$smsPercent], Purchased Email [$emailPurchased], Remaining Email [$emailBal], Remaining Email  % [$emailPercent], Purchased Voice [$voicePurchased], Remaining Voice[$voiceBal], Remaining Voice % [$voicePercent], Sms Bal Low [$smsAlert], Email Bal Low [$emailAlert], Voice Bal Low [$voiceAlert]  Low balance");
    }
    $msisdn = $phone;

    if (1 == $smsAlert && 1 == $emailAlert && 1 == $voiceAlert) {
        $bundle = "SMS, EMAIL & VOICE";
        //All Credits are less then 10 %
        $msg = "You have 10% of your $bundle bundle remaining. Kindly click the link to recharge https://txtconnect.net/cms/plans";
        //Send Alert On SMS
        $log->LogInfo("[PAYMENT 10], Payment ID [$id],  Bundle [$bundle], Text [$msg], Notification sent");
        sendSMS($msisdn, $msg);
        $subject = "Recharge reminder";
        $content = "Hi $userName<BR><BR>You have 10% of your $bundle bundle remaining. Kindly click the link to recharge https://txtconnect.net/cms/plans<BR><BR>Thanks,<BR>Team TxtConnect<BR>https://txtconnect.net";
        //Send Alert On Email
        sendMail($email, $content, $subject);
        updatePaymentNotification($id);
    } else if (1 == $smsAlert && 1 == $emailAlert && 0 == $voiceAlert) {
        $bundle = "SMS & EMAIL";
        //All Credits are less then 10 %
        $msg = "You have 10% of your $bundle bundle remaining. Kindly click the link to recharge https://txtconnect.net/cms/plans";
        //Send Alert On SMS
        $log->LogInfo("[PAYMENT 10], Payment ID [$id],  Bundle [$bundle], Text [$msg], Notification sent");
        sendSMS($msisdn, $msg);
        $subject = "Recharge reminder";
        $content = "Hi $userName<BR><BR>You have 10% of your $bundle bundle remaining. Kindly click the link to recharge https://txtconnect.net/cms/plans<BR><BR>Thanks,<BR>Team TxtConnect<BR>https://txtconnect.net";
        //Send Alert On Email
        sendMail($email, $content, $subject);
        updatePaymentNotification($id);
    } else if (1 == $smsAlert && 0 == $emailAlert && 0 == $voiceAlert) {
        $bundle = "SMS";
        //All Credits are less then 10 %
        $msg = "You have 10% of your $bundle bundle remaining. Kindly click the link to recharge https://txtconnect.net/cms/plans";
        //Send Alert On SMS
        $log->LogInfo("[PAYMENT 10], Payment ID [$id],  Bundle [$bundle], Text [$msg], Notification sent");
        sendSMS($msisdn, $msg);
        $subject = "Recharge reminder";
        $content = "Hi $userName<BR><BR>You have 10% of your $bundle bundle remaining. Kindly click the link to recharge https://txtconnect.net/cms/plans<BR><BR>Thanks,<BR>Team TxtConnect<BR>https://txtconnect.net";
        //Send Alert On Email
        sendMail($email, $content, $subject);
        updatePaymentNotification($id);
    } else if (1 == $smsAlert && 0 == $emailAlert && 1 == $voiceAlert) {
        $bundle = "SMS & VOICE";
        //All Credits are less then 10 %
        $msg = "You have 10% of your $bundle bundle remaining. Kindly click the link to recharge https://txtconnect.net/cms/plans";
        //Send Alert On SMS
        $log->LogInfo("[PAYMENT 10], Payment ID [$id],  Bundle [$bundle], Text [$msg], Notification sent");
        sendSMS($msisdn, $msg);
        $subject = "Recharge reminder";
        $content = "Hi $userName<BR><BR>You have 10% of your $bundle bundle remaining. Kindly click the link to recharge https://txtconnect.net/cms/plans<BR><BR>Thanks,<BR>Team TxtConnect<BR>https://txtconnect.net";
        //Send Alert On Email
        sendMail($email, $content, $subject);
        updatePaymentNotification($id);
    } else if (0 == $smsAlert && 1 == $emailAlert && 1 == $voiceAlert) {
        $bundle = "EMAIL & VOICE";
        //All Credits are less then 10 %
        $msg = "You have 10% of your $bundle bundle remaining. Kindly click the link to recharge https://txtconnect.net/cms/plans";
        //Send Alert On SMS
        $log->LogInfo("[PAYMENT 10], Payment ID [$id],  Bundle [$bundle], Text [$msg], Notification sent");
        sendSMS($msisdn, $msg);
        $subject = "Recharge reminder";
        $content = "Hi $userName<BR><BR>You have 10% of your $bundle bundle remaining. Kindly click the link to recharge https://txtconnect.net/cms/plans<BR><BR>Thanks,<BR>Team TxtConnect<BR>https://txtconnect.net";
        //Send Alert On Email
        sendMail($email, $content, $subject);
        updatePaymentNotification($id);

    } else if (0 == $smsAlert && 1 == $emailAlert && 0 == $voiceAlert) {
        $bundle = "EMAIL";
        //All Credits are less then 10 %
        $msg = "You have 10% of your $bundle bundle remaining. Kindly click the link to recharge https://txtconnect.net/cms/plans";
        //Send Alert On SMS
        $log->LogInfo("[PAYMENT 10], Payment ID [$id],  Bundle [$bundle], Text [$msg], Notification sent");
        sendSMS($msisdn, $msg);
        $subject = "Recharge reminder";
        $content = "Hi $userName<BR><BR>You have 10% of your $bundle bundle remaining. Kindly click the link to recharge https://txtconnect.net/cms/plans<BR><BR>Thanks,<BR>Team TxtConnect<BR>https://txtconnect.net";
        //Send Alert On Email
        sendMail($email, $content, $subject);
        updatePaymentNotification($id);
    } else if (0 == $smsAlert && 0 == $emailAlert && 1 == $voiceAlert) {
        $bundle = "VOICE";
        //All Credits are less then 10 %
        $msg = "You have 10% of your $bundle bundle remaining. Kindly click the link to recharge https://txtconnect.net/cms/plans";
        //Send Alert On SMS
        $log->LogInfo("[PAYMENT 10], Payment ID [$id],  Bundle [$bundle], Text [$msg], Notification sent");
        sendSMS($msisdn, $msg);
        $subject = "Recharge reminder";
        $content = "Hi $userName<BR><BR>You have 10% of your $bundle bundle remaining. Kindly click the link to recharge https://txtconnect.net/cms/plans<BR><BR>Thanks,<BR>Team TxtConnect<BR>https://txtconnect.net";
        //Send Alert On Email
        sendMail($email, $content, $subject);
        updatePaymentNotification($id);
    } else {
        //No notification to send
    }
}
