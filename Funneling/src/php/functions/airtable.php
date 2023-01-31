<?php

    //Create Records
    function createRecords($data){

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => AIRTABLE_ENDPOINT . "/" . rawurlencode($data->tableName),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => json_encode($data->recordObj),
            CURLOPT_HTTPHEADER => array(
                "Authorization: Bearer " . AIRTABLE_API_KEY . "",
                "Content-Type: application/json",
            ),
        ));

        //Initiate cURL
        $response = curl_exec($curl);
        $resp = json_decode($response);
        
        //Check Response Code eg: 204 / 200 / 400 etc.
        $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if ($responseCode == 200) {
            return ["status" => true, "response" => $resp];
        } else {
            return ["status" => false, "response" => $resp, "request" => __FUNCTION__];
        }

        curl_close($curl);
    }

    // Update AirTable Row
    function updateRecord($data){
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => AIRTABLE_ENDPOINT . "/" . rawurlencode($data->tableName) . "/" . $data->rowID,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "PATCH",
            CURLOPT_POSTFIELDS => json_encode($data->recordObj),
            CURLOPT_HTTPHEADER => array(
                "Authorization: Bearer " . AIRTABLE_API_KEY . "",
                "Content-Type: application/json",
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

    // Get AirTable Row
    function retrieveRecord($data){
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => AIRTABLE_ENDPOINT . "/" . rawurlencode($data->tableName) . "/" . $data->rowID,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Authorization: Bearer " . AIRTABLE_API_KEY . "",
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

    // Get AirTable Row
    function retrieveRecords($data){
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => AIRTABLE_ENDPOINT . "/" . rawurlencode($data->tableName),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Authorization: Bearer " . AIRTABLE_API_KEY . "",
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

    // Get AirTable Row
    function retrieveSpecificRecord($data){
        $curl = curl_init();

        $filter = rawurlencode(' {' . $data->columnName . '}="' . $data->keyword . '" ');

        if (isset($data->filter)) {
            $filter = rawurlencode($data->filter);
        }

        curl_setopt_array($curl, array(
            CURLOPT_URL => AIRTABLE_ENDPOINT . "/" . rawurlencode($data->tableName) . "?filterByFormula=" . $filter,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Authorization: Bearer " . AIRTABLE_API_KEY . "",
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

    //Delete Records
    function deleteRecords($data){
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => AIRTABLE_ENDPOINT . "/" . rawurlencode($data->tableName) . "/" . $data->rowID,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "DELETE",
            CURLOPT_HTTPHEADER => array(
                "Authorization: Bearer " . AIRTABLE_API_KEY . "",
            ),
        ));

        //Initiate cURL
        $response = curl_exec($curl);
        $resp = json_decode($response);

        //Check Response Code eg: 204 / 200 / 400 etc.
        $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        // if ($responseCode == 200) {
        //     return ["status" => true, "response" => $resp];
        // } else {
        //     return ["status" => false, "response" => $resp, "request" => "retrieveRecords"];
        // }
        return ["status" => true, "response" => AIRTABLE_ENDPOINT . "/" . rawurlencode($data->tableName) . "/" . $data->rowID, "request" => __FUNCTION__];

        curl_close($curl);
    }

?>