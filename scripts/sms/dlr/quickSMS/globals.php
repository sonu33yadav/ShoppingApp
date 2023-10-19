<?php
define("DELIVERED", 1);
define("NOT_DELIVERED", 2);
define("IN_SMSC_QUEUE", 4);
define("DELIVERED_TO_SMSC", 8);
define("NOT_DELIVERED_TO_SMSC", 16);
define("EXPIRED", 34);
define("LIVE", false);
if(LIVE==true){
    define("DB_HOST", "localhost");
    define("DB_NAME", "txtconnect");
    define("DB_USERNAME", "txtConnect");
    define("DB_PASSWORD", "txtConnect#2219");
}else{
    define("DB_HOST", "localhost");
    define("DB_NAME", "txtconnect");
    define("DB_USERNAME", "rapidtest");
    define("DB_PASSWORD", "rapidtest#321");
}
?>
