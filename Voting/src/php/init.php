<?php

define("AUTH", $data->key);
define("URL", $data->airtable);

function printResponse($data)
{
    echo json_encode($data);
}
