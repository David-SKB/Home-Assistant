// Generic Input Select Entity Mapper
// Maps input_select text value to entity_id for automations
// ******************************************************************
// -*- INPUTS -*-
// msg.payload : current input_select value
// msg.global_id : Context Data global identifier / Entity ID
// msg.entities : Key/Value json mapping for input_select
//
// -*- OUTPUTS -*-
// msg.payload : value entity mapping
// msg.global_id : Actual Context Data global identifier
// ******************************************************************
// Function Variables
var inputSelectStr      = msg.payload;
var inputSelectEntity   = getEntity(inputSelectStr);
//node.warn('inputSelectEntity: '+ inputSelectEntity);
var global_id           = getGlobalID(msg.global_id);
if (inputSelectEntity != null) {
    // Set global variable
    setGlobalVariable(global_id, inputSelectEntity);
    // Return details in new msg
    var newMsg = { payload: inputSelectEntity};
    newMsg.global_id = global_id;
    return newMsg;
} else {
    // Error? Log
    node.warn('Invalid/Missing Entity Mapping: '+ inputSelectEntity + ' please ensure mapping is lowercase');
    return null
}
///////////////////////////////////
//END
///////////////////////////////////
//
// Entity Retrieval Function (v1.0)
//
function getEntity (entityStr){
  var entities = msg.entities;
  if (msg.timeout) {
      return msg.payload;
  }
  if (entities == null) {
        return entities;
  }
  //node.warn('default');
  //node.warn(entities[entityStr.toLowerCase()] || entities['default']);
    return (entities[entityStr.toLowerCase()] || entities['default']);
}
//
// Global ID Retrieval Function (v1.1)
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
// Global Variable Setter Function (v1.0)
//
function setGlobalVariable (global_id, value){
    // Set global value
    global.set(global_id, value);
    node.warn('Global Variable ['+ global_id +'] set to '+ value);
}
