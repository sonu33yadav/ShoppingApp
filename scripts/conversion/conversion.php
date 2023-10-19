<?php

$campaignType = $argv[1];//QUICK - NORMAL
$campaignId = $argv[2];
$origFile = $argv[3];
$convertedFileName = $argv[4];
$logString = "Campaign Type [$campaignType], Campaign ID[$campaignId], ORIG [$origFile], CONVERTED [$convertedFileName]";
echo $logString."\n";
//exit();


shell_exec("sox $origFile -c 1 -r 8000 $convertedFileName");
?>
