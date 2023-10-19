<?php
require_once '/PHPExcel/PHPExcel.php';
require_once '9.xlsx';

// Function to parse .xlsx file
function parseXlsxFile($filePath)
{
    $objPHPExcel = PHPExcel_IOFactory::load($filePath);
    $worksheet   = $objPHPExcel->getActiveSheet();

    $highestRow    = $worksheet->getHighestRow();
    $highestColumn = $worksheet->getHighestColumn();

    $data = array();

    for ($row = 1; $row <= $highestRow; $row++) {
        $rowData = array();
        for ($col = 'A'; $col <= $highestColumn; $col++) {
            $cellValue = $worksheet->getCell($col . $row)->getValue();
            $rowData[] = $cellValue;
        }
        $data[] = $rowData;
    }

    return $data;
}

// Provide the path to your .xlsx file
$filePath = '9.xlsx';
// Parse the .xlsx file
$parsedData = parseXlsxFile($filePath);
foreach ($parsedData as $row) {
    echo implode("\t", $row) . "\n";
}
