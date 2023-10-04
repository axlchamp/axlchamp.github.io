<?php

require_once 'vendor/autoload.php';
require_once 'functions/airtable.php';
// require_once 'functions/duda.php';
// require_once 'functions/spreadsheet.php';


// Airtable INIT
define("ACCESS_TOKEN", "patvhkh2wszzLmz9A.4053f36d1fc507bc0de07e1f2e113d0afaece6c4c49d83e1f3943a4d3f8d78e3");
define("TOKEN_ID", "patvhkh2wszzLmz9A");
define("AIRTABLE_API_KEY", "keydJT50TZrtjtdel");
define("TABLE_ID", "tbl7UNMFyaRtO7SHH");
define("APP_ID", "appsjK5CG9rrYQ4zG");
define("AIRTABLE_ENDPOINT", "https://api.airtable.com/v0/" . APP_ID ."/". TABLE_ID);

// Actions Custom Function for front-end handling data/error
function printResponse($response) {
    if ($response['status']) {
        print_r(json_encode($response));
    } else {
        die(json_encode($response));
    }
}