<?php

function create_session($data)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://api.stripe.com/v1/checkout/sessions',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => $data->obj_session,
        CURLOPT_HTTPHEADER => array(
            'Authorization: Basic ' . STRIPE_AUTH,
            'Content-Type: application/x-www-form-urlencoded',
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

function payment_intent($data)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://api.stripe.com/v1/payment_intents',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => $data->obj_payment,
        CURLOPT_HTTPHEADER => array(
            'Authorization: Basic ' . STRIPE_AUTH,
            'Content-Type: application/x-www-form-urlencoded',
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
