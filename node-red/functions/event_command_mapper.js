// Event Command Mapper (v1.0)
// Maps zha_event events for buttons/remotes to a service call
// ******************************************************************
// -*- INPUTS -*-
// msg.payload.event        : Event data
// msg.payload.config       : Remote_interface config
//
// -*- OUTPUTS -*-
// msg.payload              : command.action payload (Call Service)
// ******************************************************************

/*** START ***/
const utils = global.get("utils");

const remote_interface = msg.payload.config;

// Assuming you have received the event data in `msg.payload.event`
const event = msg.payload.event;

// Extract device, button, and command information from the event
const device_id = event.device_id;
const button_id = event.args.button || "on"; // Default to "on" if no button is specified
const command_id = event.command;

try {

    // Instantiate DeviceManagers 
    const deviceTypeManager = new utils.DeviceManager(remote_interface.device_type);

    const device_type = deviceTypeManager.getDevice(device_id);

    // Get the remote ID for the device from deviceRemoteManager
    const deviceRemoteManager = new utils.DeviceManager(remote_interface[device_type]["devices"]);
    const remote_id = deviceRemoteManager.getDevice(device_id);

    // Instantiate RemoteInterface
    const remoteInterface = new utils.RemoteInterface(remote_interface[device_type]);

    // Get the command object from RemoteInterface
    const command = remoteInterface.getCommand(remote_id, button_id, command_id);
    
    // Extract the action from the command and assign it to msg.payload
    msg.payload = command.action;

    // Send the message downstream
    return msg;

} catch (error) {
    // Handle errors, such as device or command not found
    node.error(`Error processing event: ${error.message}`);
}
/*** END ***/