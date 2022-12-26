// Global Variable Entity Mapper (v1.6) [DEPRECIATED - moved functionality to entity_filter]
// Maps msg.payload value to global variable using msg.global_id 
// for automations
// ******************************************************************
// -*- INPUTS -*-
// msg.payload : value to be set
// msg.global_id : Context Data global identifier / Entity ID
//
// -*- OUTPUTS -*-
// msg.payload : mapped value
// msg.global_id : Actual Context Data global identifier
// ******************************************************************
// Function Variables
var globalContextID = '';
var global_id = getGlobalID(msg.global_id);
if (global_id != null) {
    // Set global variable
    setGlobalVariable(global_id, msg.payload);
    // Return details in new msg
    newMsg = { payload: msg.payload};
    newMsg = { global_id: global_id};
    return newMsg;
} else {
    node.warn('[ERROR] missing/invalid global_id: ' + msg.global_id);
    return msg;
}
//********************************
//END
//********************************
//
// Global ID Retrieval Function (v1.0)
//
function getGlobalID (global_id){
    //Check if entity_id was passed
    if (global_id != null && global_id.includes(".")) {
        global_id = global_id.split(".")[1];
    } else {
        global_id = global_id;
    }
    // Return global value
    return global_id;
}
//
// Global Variable Setter Function (v1.0) need to be split out...
//
function setGlobalVariable (global_id, value){
    // Set global value
    global.set(global_id, value);
    node.warn('Global Variable ['+ global_id +'] set to '+ value);
}