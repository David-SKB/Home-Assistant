// API for retrieving entities via global_id. 
// Entity has to be mapped in an updated before it can be accessed

var payload = {};

var global_id = (typeof msg.req.query.id === 'undefined') ? "" : msg.req.query.id;
node.warn(global_id);

if (!global_id) {
    var error_msg = "Missing global_id";
    node.warn(error_msg)
    payload["response_code"] = 404;
    payload["message"] = error_msg;
    msg.payload = payload;
    return [null, msg];
}
var global_value = global.get(global_id);
node.warn(global_value);

if (!global_value) {
    var error_msg = "Invalid global_id/value";
    node.warn(error_msg)
    //payload = { global_id: null };
    payload["response_code"] = 404;
    payload["message"] = error_msg;
    msg.payload = payload;
    return [null, msg];
}

payload[global_id] = global_value;
msg.payload = payload;
return [msg, null];
