// [WIP] PUT request for controlling entities via API
// entitiy must be exposed in an updater
// I'm yet to limit it to entities exposed via global variables, can control anything atm o.O
var payload = {};

//var domain = msg.req.query.domain;
var domain = (typeof msg.req.query.domain === 'undefined') ? "" : msg.req.query.domain;
node.warn(domain);

//var service = msg.req.query.service;
var service = (typeof msg.req.query.service === 'undefined') ? "" : msg.req.query.service;
node.warn(service);

//var entity_id = msg.req.query.entity_id;
var entity_id = (typeof msg.req.query.entity_id === 'undefined') ? "" : msg.req.query.entity_id;
node.warn(entity_id);

if (!domain) {
    var error_msg = "No domain provided";
    node.warn(error_msg)
    payload["response_code"]    = 404;
    payload["message"]          = error_msg;
    msg.payload = payload;
    return [null, msg];
}

if (!service) {
    var error_msg = "No service provided";
    node.warn(error_msg)
    payload["response_code"]    = 404;
    payload["message"]          = error_msg;
    msg.payload = payload;
    return [null, msg];
}

if (!entity_id) {
    var error_msg = "No entity_id provided";
    node.warn(error_msg)
    //payload = { global_id: null };
    payload["response_code"]    = 404;
    payload["message"]          = error_msg;
    msg.payload = payload;
    return [null, msg];
}

//set msg variables for use in call service node
msg.domain      = domain;
msg.service     = service;
msg.entity_id   = entity_id;

payload["response_code"] = 200;
msg.payload = payload;
return [msg, null];
