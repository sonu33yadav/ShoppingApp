<?php

define("LIVE", false);
//define("SMS_SEND_METHOD", "INSERT");
define("SMS_SEND_METHOD", "API");
if (LIVE == true) {
    define("MAIL_MAILER", "smtp");
    define("MAIL_HOST", "62.129.139.10");
    define("MAIL_PORT", "25");
    define("MAIL_FROM_ADDRESS", "noreply@txtconnect.net");
    define("MAIL_PASSWORD", '');
    define("MAIL_SECURE", false);
    define("MAIL_FROM_NAME", "TxtConnect");
    define("DB_USERNAME", "txtConnect");
    define("DB_PASSWORD", "txtConnect#2219");
    define("DB2_USERNAME", "txtgh_kannel");
    define("DB2_PASSWORD", "s3khaPQL");
    define("DB2_HOST", "62.129.149.53");
    define("DB2_NAME", "kannel_v3");
    define("DEFAULT_DIR", "/var/www/html/PROJECTS/SmsPortal/node-backend/users/upload/campaign/");
    define("FILEPATH_URL", "https://staging.txtconnect.net/api/static");
    define('PATH', '/var/www/html/PROJECTS/SmsPortal/node-backend/scripts/scheduler/');
    define('ATTACHMENT_PATH', '/var/www/html/PROJECTS/SmsPortal/node-backend/users/upload/emailAttachments/campaign/');
} else {
    define("MAIL_MAILER", "smtp");
    define("MAIL_HOST", "smtp.elasticemail.com");
    define("MAIL_PORT", "2525");
    define("MAIL_FROM_ADDRESS", "delhishankarsingh@gmail.com");
    define("MAIL_PASSWORD", 'C1FE98B1554CE5680B190A28A678EE9F7532');
    define("MAIL_SECURE", true);
    define("MAIL_FROM_NAME", "TxtConnect");
    define("DB_USERNAME", "rapidtest");
    define("DB_PASSWORD", "rapidtest#321");
    define("DEFAULT_DIR", "/var/www/html/PROJECTS/SmsPortal/node-backend/users/upload/campaign/");
    define("FILEPATH_URL", "https://txtconnect.watchmyproduct.com/api/static");
    define('PATH', '/var/www/html/PROJECTS/SmsPortal/node-backend/scripts/scheduler/');
    define('ATTACHMENT_PATH', '/var/www/html/PROJECTS/TxtGhana/txtconnect/node-backend/users/upload/emailAttachments/campaign/');
}
;

define("EMAIL_SENT", "1");
define("EMAIL_DELIVERED", "2");
define("EMAIL_NOT_DELIVERED", "3");

define("KANNEL_USER", "txtgh_url");
define("KANNEL_PASS", "pass0wd_url");
define("KANNEL_HOST", "62.129.149.188");
define("KANNEL_PORT", "13013");
define("CAMP_DLR_ENDPOINT", "http://20.228.184.53/PROJECTS/TxtGhana/Txtconnect/txtconnect-node-backend/scripts/sms/dlr/campaign/dlr.php");

// FOR VOICE
define("AUDIO_COPY_PATH", "/mnt/client/var/www/html/TxtConnect/audio");
define("MSC_IP", "196.201.48.139");
define("MSC_PORT", "5060");
define("MSC_WAIT_TIME", "45");
define("ASTERIK_PATH", "/mnt/client/var/spool/asterisk/outgoing");
define("ASTERIK_AUDIO_PATH", "/var/www/html/TxtConnect/audio");
define("CALL_LIMIT", "30");
define("CALL_PAUSE_TIME", "2");
//SMS
define("USER_NAME", "DigitalPay");
define("PASSWORD", "Aug@2023");
define("ORIGIN_ADDR", "DigitalPay");
