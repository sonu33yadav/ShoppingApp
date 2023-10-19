<?php
function isTokenGenerating($clientId)
{
    global $VODA_GENERATE_TOKEN_URL, $VODA_CLIENT_ID, $VODA_CLIENT_SECRET;
    $fileName = $clientId . "_TOKEN_STATUS.json";
    if (file_exists($fileName)) {
        return file_get_contents($fileName);
    } else {

        return "N";
    }
}

function vodafoneGenerateToken($clientId, $clientSecret)
{
    $endpoint = "https://sdp.vodafone.com.gh/oauth/token?grant_type=client_credentials";
    $clentId = urlencode($clientId);
    $secret = urlencode($clientSecret);
    $auth = base64_encode("$clentId:$secret");
    $headers = array("Authorization: Basic $auth", 'Content-Type: application/x-www-form-urlencoded');
    $curl_handle = curl_init();
    curl_setopt($curl_handle, CURLOPT_POST, 1);
    curl_setopt($curl_handle, CURLOPT_URL, $endpoint);
    curl_setopt($curl_handle, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl_handle, CURLOPT_HEADER, 0);
    curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
    $response = curl_exec($curl_handle);
    return $response;
}

function vodaTokenCache($clientId, $clientSecret)
{
    $isGenerating = isTokenGenerating($clientId);
    if ("Y" == $isGenerating) {
        sleep(30);
    }
    $fileName = $clientId . "_accessToken.json";
    $fileWaitName = $clientId . "_TOKEN_STATUS.json";
    if (file_exists($fileName)) {
        if (ceil((time() - filemtime($fileName)) / 60) < 30) {
            file_put_contents($fileWaitName, "N");
            return file_get_contents($fileName);
        } else {
            file_put_contents($fileWaitName, "Y");
            $return = vodafoneGenerateToken($clientId, $clientSecret);
            file_put_contents($fileName, $return);
            file_put_contents($fileWaitName, "N");
            return $return;
        }
    } else {
        $return = vodafoneGenerateToken($clientId, $clientSecret);
        file_put_contents($fileName, $return);
        return $return;
    }

}
function vodaBilling($payload, $apiClientId, $apiClientSecret)
{
    $payload = json_encode($payload, true);
    $endpoint = "https://sdp.vodafone.com.gh/vfgh/gw/charging/v1/charge";
    $tokenData = json_decode(vodaTokenCache($apiClientId, $apiClientSecret), true);
    $token = $tokenData['access_token'];
    $headers = array("Authorization: Bearer $token", 'Content-Type: application/json');
    $curl_handle = curl_init();
    curl_setopt($curl_handle, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($curl_handle, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($curl_handle, CURLOPT_URL, $endpoint);
    curl_setopt($curl_handle, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl_handle, CURLOPT_HEADER, 0);
    curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
    $response = curl_exec($curl_handle);
    return $response;
}
$msisdn = "233202729851";
$lastChar                                 = substr($msisdn, -6);
$transId                                  = "BILL" . date("YmdHis") . $lastChar . rand(10000, 99999) . substr(time(), -7);
$clientRequestId                          = "BILLCR" . date("YmdHis") . $lastChar . rand(10000, 99999) . substr(time(), -7);
$payloadBill["amount"]                    = 0.25;
$payloadBill["clientChargeTransactionId"] = $transId;
$payloadBill["clientRequestId"]           = $clientRequestId;
$payloadBill["Channel"]                   = "USSD";
$payloadBill["msisdn"]                    = $msisdn;
$payloadBill["description"]               = "Daily Charging";
$payloadBill["unit"]                      = 2;
$billData                                 = vodaBilling($payloadBill, '6c2f7d71ec2d9b0c556b6ed473c99a27bbf23dd1', '58fe88eb837c6396681151c44af608cc721fbede');
echo $billData;
?>
