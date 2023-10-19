<?php

define("LIVE", false);

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
    define("DEFAULT_DIR", "/var/www/txtconnect/node-backend/users/upload/campaign/");
    define("FILEPATH_URL", "https://txtconnect.net/api/static");
    define('PATH', '/var/www/txtconnect/node-backend/scripts/scheduler/');
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
    define("DEFAULT_DIR", "/var/www/html/PROJECTS/TxtGhana/Txtconnect/live/txtconnect/node-backend/users/upload/campaign/");
    define("FILEPATH_URL", "https://txtconnect.watchmyproduct.com/api/static");
    define('PATH', '/var/www/html/PROJECTS/TxtGhana/Txtconnect/live/txtconnect/node-backend/scripts/scheduler/');
}
;

define("EMAIL_SENT", "1");
define("EMAIL_DELIVERED", "2");
define("EMAIL_NOT_DELIVERED", "3");

define("KANNEL_USER", "txtgh_url");
define("KANNEL_PASS", "pass0wd_url");
define("KANNEL_HOST", "62.129.149.188");
define("KANNEL_PORT", "13013");
