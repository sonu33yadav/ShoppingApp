<?php
function createCSVFile($fileName)
{
    $list = array
        (
                array("Date","Total Beeps", "Unique Beeps" ,"Successfull Beeps", "Failed Beeps", "Succesfful Percentage", "SMS Notifcations", "Discarded SMS"),
        );
    $file = fopen($fileName,"w");
    foreach ($list as $line)
    {
        fputcsv($file, $line);
    }
    fclose($file);
}
createCSVFile("a.xlsx");
?>
