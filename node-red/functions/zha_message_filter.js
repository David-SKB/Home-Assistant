// Filters IKEA Smart Button zha_event messages (v1.0)
//
var deviceID    = msg.topic;
var service     = getService(deviceID);
var command     = getCommand(msg.command);
//
//service.command = command
//service.device = deviceID
var newMsg = {
    device  : deviceID,
    command  : command,
    payload : service
};
//
//node.warn('newMsg:');
//node.warn(newMsg);
return newMsg;
//
// Maps Device ID to Device Name, hardcoded for now...
// 
function getService (deviceID){
    //node.warn("getDevice");
    var deviceList = 
    {
      '06f405efcffb49f72c755a99c62a2e9c'    : global.get('ikea_smart_button_1'),
      'fdf5c8b9cff53211f2fcf6909dc51d3e'    : global.get('ikea_smart_button_2')
    };
    //node.warn(deviceList[deviceID]);
    return (deviceList[deviceID] || null);
}
//
// Returns action type, will make generic in future to make it 
// easier for different buttons to share the same functions
//
function getCommand (command){
    //node.warn("getCommand");
    var commandList = 
    {
      'on'                  : 'SINGLE-PRESS',
      'move_with_on_off'    : 'SINGLE-PRESS-HOLD-START',
      'stop'                : 'SINGLE-PRESS-HOLD-STOP',
      'check-in'            : 'CHECK-IN-DASH',
      'check_in'            : 'CHECK-IN-US'
    };
    //node.warn(commandList[command]);
    return (commandList[command] || null);
}