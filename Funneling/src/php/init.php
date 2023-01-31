<?php
require_once 'vendor/autoload.php';
require_once 'functions/stripe.php';

define("STRIPE_PK", "pk_test_51LnWexIPD6zQleLGWlvHK6L0YXvdeQaKDxUj5DHR916QB4nb6iw2I7xdQY5dKUFM926nDo5OZOK8cknLKKHmqCD700ZfzgtofG");
define("STRIPE_SK", "sk_test_51LnWexIPD6zQleLGfYIR5QJJtLcc2lULtSoFitzJ9dH5t24YVA7C7Z3BHoW2eTPLjO54GL0LRaKOTV0Br1lrywVb00vATXcZRS");
define("STRIPE_AUTH", "c2tfdGVzdF81MUxuV2V4SVBENnpRbGVMR2ZZSVI1UUpKdExjYzJsVUx0U29GaXR6SjlkSDV0MjRZVkE3QzdaM0JIb1cyZVRQTGpPNTRHTDBMUmFLT1RWMEJyMWxyeXdWYjAwdkFUWGNaUlM6");
define("SUCCESS_URL", "http://localhost/Projects/Funneling/views/success.html");
define("CANCEL_URL", "http://localhost/Projects/Funneling/views/cancel.html");


// Actions Custom Function for front-end handling data/error
function print_response($response)
{
    if ($response['status']) {
        print_r(json_encode($response));
    } else {
        die(json_encode($response));
    }
}