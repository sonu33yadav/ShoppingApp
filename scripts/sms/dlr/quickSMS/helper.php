<?php
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
?>
