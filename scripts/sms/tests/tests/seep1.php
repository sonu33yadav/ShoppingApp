<?php
$totalSent = exec ("cat sendSms.php|grep 'Content Sent successfully'|wc -l");
echo $outPut;

?>
