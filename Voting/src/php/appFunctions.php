<?php
include "init.php";

function getVotes()
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => URL,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer ' . AUTH,
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    if ($response) {
        return (object) array("status" => true, "result" => $response);
    }
    return (object) array("status" => false, "result" => $response);
}

function updateVotes($data)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => URL,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'PATCH',
        CURLOPT_POSTFIELDS => $data->record,
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer ' . AUTH,
            'Content-Type: application/json',
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    if ($response) {
        return (object) array("status" => true, "result" => $response);
    }
    return (object) array("status" => false, "result" => $response);

}
