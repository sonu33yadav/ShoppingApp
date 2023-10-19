<?php

function sendSMSApi($msisdn, $msg)
{
    $baseUrl = 'https://messaging.airtel.co.zm:9002/smshttpquery/qs?';
    $newurl  = $baseUrl .
    'REQUESTTYPE=SMSSubmitReq' .
    '&USERNAME=' . USER_NAME .
    '&PASSWORD=' . PASSWORD .
    '&MOBILENO=' . $msisdn .
    '&MESSAGE=' . urlencode($msg) .
        '&ORIGIN_ADDR=' . ORIGIN_ADDR .
        '&TYPE=0';

    try {
        // Send HTTP GET request
        $response = file_get_contents($newurl);

        if ($response === false) {
            throw new Exception("Error sending SMS.");
        }
        $parts = explode('|', $response);

        // // Update campaign status and success count here
        // updateCampaignStatus($campaignId);
        // updateCampaignSuccessCount($campaignId);
        echo json_encode(['message' => 'SMS sent successfully', 'response' => $parts]);
        return json_encode(['message' => 'SMS sent successfully', 'response' => $parts]);

    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function sendSMS($msisdn, $msg, $from, $campaignId, $userId, $smsc = 'MTN_BULK')
{
    if (SMS_SEND_METHOD == "API") {
        sendSMSApi($msisdn, $msg, $from, $campaignId, $userId, $smsc);
    } else {
        $dlrURL = CAMP_DLR_ENDPOINT . "?userId={$userId}&campaignId={$campaignId}&type=%d&receiver=%p&reply=%A&message=%b";
        insertKannelDB($from, $msisdn, $msg, $smsc, $dlrURL, $campaignId);
    }
    return true;
}
