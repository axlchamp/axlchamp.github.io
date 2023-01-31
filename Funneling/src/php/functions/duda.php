
<?php
use phpseclib\Crypt\RSA;

function sso_Authenticate($data)
{

    //Decode Data
    $data->site_name = urldecode($data->site_name);
    $data->sdk_url = urldecode($data->sdk_url);
    $data->timestamp = urldecode($data->timestamp);
    $data->secure_sig = urldecode($data->secure_sig);

    // Compose Message (Sig Data to Verify)
    $data->data_sig_to_verify = $data->site_name . ':' . $data->sdk_url . ':' . $data->timestamp;

    $rsa = new RSA();
    $rsa->setEncryptionMode(RSA::ENCRYPTION_PKCS1);
    $ciphertext = base64_decode($data->secure_sig);
    $rsa->loadKey($data->public_key); // public key
    $data->output = $rsa->decrypt($ciphertext);

    if ($data->data_sig_to_verify === $data->output) {
        return ["status" => true, "response" => $data, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $data, "request" => __FUNCTION__];
    }

}

//Get Account Details (/accounts/{account_name})
function get_Account($data)
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/accounts/" . $data->account_name,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "Content-Type: application/json",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl); //200
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    curl_close($curl);

    $response = json_decode($resp);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => false, "response" => "Account " . $data->account_name . " Already Exist.", "request" => __FUNCTION__];
    } else {
        return ["status" => true, "response" => $response->message, "request" => __FUNCTION__];
    }

} //get_Account

//Create Account (/accounts/{account_name})
function create_Account($data)
{

    $body_params = ["account_name" => $data->account_name];

    if (isset($data->first_name)) {
        $body_params['first_name'] = $data->first_name;
    }

    if (isset($data->last_name)) {
        $body_params['last_name'] = $data->last_name;
    }

    if (isset($data->email)) {
        $body_params['email'] = $data->email;
    }

    if (isset($data->lang)) {
        $body_params['lang'] = $data->lang;
    }

    if (isset($data->account_type)) {
        $body_params['account_type'] = $data->account_type;
    }

    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/accounts/create",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($body_params),
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "Content-Type: application/json",
            "cache-control: no-cache",
        ),
    )
    );
    //Initiate cURL
    $resp = curl_exec($curl);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    curl_close($curl);

    $response = json_decode($resp);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //create_Account

//Update Content Library (/sites/multiscreen/{site_name}/content)
function update_Content_Library($data)
{

    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/sites/multiscreen/" . $data->site_name . "/content",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($data->data_fields),
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "Content-Type: application/json",
            "cache-control: no-cache",
        ),
    )
    );
    //Initiate cURL
    $resp = curl_exec($curl);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    curl_close($curl);

    $response = json_decode($resp);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //Update Content Library

//Inject Content (/sites/multiscreen/inject-content/site_name)
function inject_Content($data)
{

    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/sites/multiscreen/inject-content/" . $data->site_name,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($data->data_fields),
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "Content-Type: application/json",
            "cache-control: no-cache",
        ),
    )
    );
    //Initiate cURL
    $resp = curl_exec($curl);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    curl_close($curl);

    $response = json_decode($resp);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //Inject Content

//Upload Resources (/sites/multiscreen/resources/{site_name}/upload)
function upload_Resources($data)
{

    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/sites/multiscreen/resources/" . $data->site_name . "/upload",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($data->data_fields),
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "Content-Type: application/json",
            "cache-control: no-cache",
        ),
    )
    );
    //Initiate cURL
    $resp = curl_exec($curl);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    curl_close($curl);

    $response = json_decode($resp);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //Upload Resourcfes

//Create Site (/sites/multiscreen/create)
function create_Site($data)
{

    $body_params = [
        "template_id" => $data->template_ID,
    ];

    if (isset($data->default_domain_prefix)) {
        $body_params['default_domain_prefix'] = $data->default_domain_prefix;
    }

    if (isset($data->lang)) {
        $body_params['lang'] = $data->lang;
    }

    if (isset($data->site_data)) {
        $body_params['site_data'] = $data->site_data;
    }

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/sites/multiscreen/create",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($body_params),
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "Content-Type: application/json",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($resp); //{"site_name":"28e1182c"}

    curl_close($curl);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //create_Site

//Get Stats Email /accounts/{account_name}/sites/{site_name}/stats-email
function stats_Email($data)
{

    $body_params = ["frequency" => $data->email_frequency];

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/accounts/" . $data->email . "/sites/" . $data->site_alias . "/stats-email",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($body_params),
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "Content-Type: application/json",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl); //200
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($resp);

    curl_close($curl);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //stats_Email

//Update Site Plan
function update_Site_Plan($data)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/sites/multiscreen/" . $data->site_alias . "/plan/" . $data->contract_ID,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($resp);

    curl_close($curl);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //Update Site Plan

//Create Site (/sites/multiscreen/update/{site_name})
function update_Site($data)
{

    $body_params = [
        "default_domain_prefix" => $data->default_domain_prefix,
    ];

    if (isset($data->site_domain)) {
        $body_params['site_domain'] = $data->site_domain;
    }

    if (isset($data->external_uid)) {
        $body_params['external_uid'] = $data->external_uid;
    }

    if (isset($data->lang)) {
        $body_params['lang'] = $data->lang;
    }

    if (isset($data->site_alternate_domains)) {
        $body_params['site_alternate_domains'] = $data->site_alternate_domains;
    }

    if (isset($data->force_https)) {
        $body_params['force_https'] = $data->force_https;
    }

    if (isset($data->site_seo)) {
        $body_params['site_seo'] = $data->site_seo;
    }

    if (isset($data->fav_icon)) {
        $body_params['fav_icon'] = $data->fav_icon;
    }

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/sites/multiscreen/update/" . $data->site_name,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($body_params),
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "Content-Type: application/json",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl); //{"template_id": 1000772}
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($resp);

    curl_close($curl);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //create_Site

//Get Reset Password Link (/accounts/reset-password/{account_name})
function reset_Password($data)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/accounts/reset-password/" . $data->account_name,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl); //200
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($resp);

    curl_close($curl);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //reset_Password

//Grant Access (/accounts/{account_name}/sites/{site_name}/permissions)
function grant_Access($data)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/accounts/" . $data->account_name . "/sites/" . $data->site_alias . "/permissions",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($data->permissions),
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "Content-Type: application/json",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl); //204);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($resp);

    curl_close($curl);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //grant_Access

//Generate SSO Link (/accounts/sso/{account_name}/link?target=EDITOR&site_name=h5de912a)
function generate_SSO($data)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/accounts/sso/" . $data->account_name . "/link?target=EDITOR&site_name=" . $data->site_alias . "",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl); //204);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($resp);

    curl_close($curl);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //generate_SSO

//Get Site Details (/sites/multiscreen/site_name)
function get_Site_Details($data)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/sites/multiscreen/" . $data->site_name,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl); //204);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($resp);

    curl_close($curl);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //get_Site_Details

//Get All Templates (/sites/multiscreen/templates)
function get_Templates()
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/sites/multiscreen/templates",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl); //204);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($resp);

    curl_close($curl);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //get_Site_Details

/* PUBLISH - UNPUBLISHED - REMOVE ACCESS - DELETE ACCOUNT - DELETE SITE */

//Publish Site (/sites/multiscreen/publish/{site_name})
function publish_Site($data)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/sites/multiscreen/publish/" . $data->site_name,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "Content-Type: application/json",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl); //204);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($resp);

    curl_close($curl);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //publish_Site

//Unpublish Site (/sites/multiscreen/unpublish/{site_name})
function unpublish_Site($data)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/sites/multiscreen/unpublish/" . $data->site_name,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "Content-Type: application/json",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl); //204);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($resp);

    curl_close($curl);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //unpublish_Site

//Delete Site (DELETE /sites/multiscreen/{site_name})
function delete_Site($data)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/sites/multiscreen/" . $data->site_name,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "DELETE",
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "Content-Type: application/json",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl); //204);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($resp);

    curl_close($curl);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //unpublish_Site

//Delete Account Access /accounts/{account_name}/sites/{site_name}/permissions
function delete_Access($data)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/accounts/" . $data->account_name . "/sites/" . $data->site_alias . "/permissions",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "DELETE",
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "Content-Type: application/json",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl); //204);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($resp);

    curl_close($curl);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //delete_Access

//Delete Account (DELETE /accounts/{account_name})
function delete_Account($data)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/accounts/" . $data->account_name,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "DELETE",
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "Content-Type: application/json",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl); //204);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($resp);

    curl_close($curl);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }

} //delete_Account

//Duplicate Site (POST  /sites/multiscreen/duplicate/{site_name})
function duplicate_Site($data)
{
    $body_params = [
        "new_default_domain_prefix" => $data->new_default_domain_prefix,
        "new_external_uid" => $data->new_external_uid,
    ];

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS["live_endpoint"] . "/sites/multiscreen/duplicate/" . $data->site_name,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($body_params),
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . $GLOBALS["DUDA_API_KEY"] . "",
            "Content-Type: application/json",
            "cache-control: no-cache",
        ),
    ));

    //Initiate cURL
    $resp = curl_exec($curl);
    //Check Response Code eg: 240 / 200 / 400 etc.
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($resp);

    curl_close($curl);

    if ($responseCode == 200 || $responseCode == 204) {
        return ["status" => true, "response" => $response, "request" => __FUNCTION__];
    } else {
        return ["status" => false, "response" => $response->message, "request" => __FUNCTION__];
    }
}

?>