<?php
require 'init.php';
require_once __DIR__ . '/vendor/autoload.php';
$payload = file_get_contents('php://input');
$data = json_decode($payload);

switch ($data->action) {
    case "Create Record":
            $record_created = createRecords($data);
            printResponse($record_created);
        break;

    case "Get Record":
            $record_get = retrieveRecords($data);
            printResponse($record_get);
        break;
    default:
        printResponse(["status"=>false]);

}
