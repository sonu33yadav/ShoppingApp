<?php
$text = "id:0900414684 sub:000 dlvrd:000 submit date:2211220813 done date:2211220813 stat:DELIVRD err:000 Text:";
function parseDLRs($text)
{
	$explode = explode(" ", $text);
	foreach($explode as $val)
	{
		$row = explode(":", $val);
		if(count($row)>1)
			$data[$row[0]] = $row[1];
	}
	return $data;
}
echo print_r(parseDLRs($text));
?>
