<?php
$payload = file_get_contents('php://input');
$data = json_decode($payload);

include "appFunctions.php";

if (!isset($data->action)) {
    $result = (object) array("status" => "false", "response" => "No action field", "message" => "action is required");
    echo printResponse($result);
}
if (!isset($data->key) || $data->key == "") {
    $result = (object) array("status" => "false", "response" => "No key field", "message" => "key is required");
    echo printResponse($result);
}

switch ($data->action) {
    case "Get Votes":
        $votes = getVotes();
        printResponse($votes);
        break;
    case "Up Votes":
        $votes = updateVotes($data);
        printResponse($votes);
        break;
    default:"";
}
