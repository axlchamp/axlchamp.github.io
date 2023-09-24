<?php
require 'init.php';
// require_once __DIR__ . '/vendor/autoload.php';
$payload = file_get_contents('php://input');
$data = json_decode($payload);

switch ($data->action) {
    case "Initialize oAuth":

        break;
    default:
        printResponse($auth_code);

}
