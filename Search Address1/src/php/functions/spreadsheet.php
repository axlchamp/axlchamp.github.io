<?php

    function getSheetName($data) {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://sheets.googleapis.com/v4/spreadsheets/' . $data->sheetID,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => array(
                'Authorization: Bearer ' . $data->token,
                'Accept: application/json',
                'Content-Type: application/json',
            ),
        ));

        //Initiate cURL
        $response = curl_exec($curl);
        $resp = json_decode($response);

        //Check Response Code eg: 204 / 200 / 400 etc.
        $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if ($responseCode == 200) {
            return ["status" => true, "response" => $resp, "request" => __FUNCTION__];
        } else {
            return ["status" => false, "response" => $resp, "request" => __FUNCTION__];
        }

        curl_close($curl);
    }

    function changePermission($data) {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://www.googleapis.com/drive/v3/files/' . $data->sheetID . '/permissions',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => '{"role":"writer","type":"anyone"}',
            CURLOPT_HTTPHEADER => array(
                'Authorization: Bearer ' . $data->token,
                'Accept: application/json',
                'Content-Type: application/json',
            ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        return $response;
    }

?>