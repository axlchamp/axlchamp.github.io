<?php

// require_once 'vendor/autoload.php';
// require_once 'functions/airtable.php';
// require_once 'functions/duda.php';
// require_once 'functions/spreadsheet.php';


// Init Stripe
define("SK_KEY", "sk_test_51HEqlJATKYg0tPGZrD8sXxA663hWbejmLouwEwKpmOWRO3DJfsqYeQTanQYrPeMLe1LWBzK1vvVoklxn0pdLBSSH003PdvFS1M");


// Pre defined DUDA Init
$endpoint = 'https://api-sandbox.duda.co/api';

define("endpoint", $endpoint);

// Actions Custom Function for front-end handling data/error
function printResponse($response) {
    if ($response['status']) {
        print_r(json_encode($response));
    } else {
        die(json_encode($response));
    }
}