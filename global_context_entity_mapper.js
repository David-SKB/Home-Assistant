// Global Context Entity Mapper (v1.5)
// Maps entity state to global variable for automations
// ******************************************************************
// -*- INPUTS -*-
// msg.payload              : current entity state value
// msg.global_id            : Global Context identifier / Entity ID
// msg.entities [OPTIONAL]  : Key/Value json mapping for input_select entities
//
// -*- OUTPUTS -*-
// msg.payload              : global variable value
// msg.global_id            : Actual Global Context identifier
// ******************************************************************

/*** START ***/
var entityState = getStateMapping(msg.payload);
//node.warn('inputSelectEntity: '+ inputSelectEntity);
var globalID = getGlobalID(msg.global_id);
if (entityState != null && globalID) {
    // Set global variable
    setGlobalVariable(globalID, entityState);
    // Return details in msg for further processing if needed
    msg.payload = entityState;
    msg.global_id = globalID;
    // Consider writing another function to determine wheter to clear
    // the msg object and what items to potentially keep etc.
    return msg;
} else {
    // Error? Log, needs to be fleshed out with proper cause identified
    node.warn('Invalid/Missing Entity Mapping: ' + msg.payload + ' please ensure mapping is lowercase');
    return null;
}
/*** END ***/

/*** HELPER FUNCTIONS ***/

/**
* Entity State Mapping Retrieval Function (v1.1) *
* @param {string} state
*/
function getStateMapping(state) {
    var entityMapping = msg.entities;
    // If timeout value flag is true, ignore mapping
    if (msg.timeout) {
        return msg.payload;
    }
    // Return state as is if no mapping provided
    if (entityMapping == null) {
        return state;
    }
    // Otherwise return corresponding mapping for state (lowercase) 
    // or default value if no map found, otherwise null
    //node.warn('getStateMapping: ' + entities[entityStr.toLowerCase()] || entities['default']);
    return (entityMapping[state.toLowerCase()] || entityMapping['default'] || null);
}

/**
* Global ID Retrieval Function (v1.2) *
* @param {string} global_id
*/
function getGlobalID(global_id) {
    // If an entity_id was passed, remove entity type
    if (global_id != null && global_id.includes(".")) {
        global_id = global_id.split(".")[1];
    }
    // Return global ID
    return global_id;
}

/**
* Global Variable Setter Function (v1.0) *
* @param {string} global_id
* @param {string} value
*/
function setGlobalVariable(global_id, value) {
    // Set global value
    global.set(global_id, value);
    node.warn('Global Variable [' + global_id + '] set to ' + value);
}
