<?php
require 'init.php';

$payload = file_get_contents('php://input');
$data = json_decode($payload);

switch ($data->action) {
    case "Create Session";
        if (!isset($data->action) || !$data->action) {
            die(json_encode(["status" => false, "response" => "Oops! action is required."]));
        }

        $data->obj_session = "success_url=" . SUCCESS_URL . "&cancel_url=" . CANCEL_URL . "&line_items[0][price][product_data][name]=" . $data->prod_id . "&line_items[0][quantity]=1&mode=payment";
        $data->obj_session = "success_url=" . SUCCESS_URL . "&cancel_url=" . CANCEL_URL . "&line_items[0][price_data][currency]=usd&line_items[0][quantity]=1&line_items[0][price_data][product_data][name]=test&mode=payment&line_items[0][price_data][unit_amount]=20000";
        $obj_session = create_session($data)['response'];
        $data->obj_payment = 'amount=' . $obj_session->amount_total . '&currency=usd&payment_method_types%5B%5D=link&payment_method_types%5B%5D=card';
        $obj_payment = payment_intent($data);
        print_response($obj_payment);
        break;
    default:
        die(json_encode(["status" => false, "response" => "Oops! action is required."]));
}
