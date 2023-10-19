<?php
require_once "./KLogger/KLogger.php";
require_once "./helper.php";
require_once "./globals.php";
$log = new KLogger("./log/", KLogger::DEBUG);
$log->LogInfo("[REQ], ". print_r($_GET, true));
if(DELIVERED == $_GET['type'])
{
	$data = parseDLRs($text);
}
file_put_contents("dlr.txt", print_r($_GET, true)."\n", FILE_APPEND);
echo "RECV";
?>
