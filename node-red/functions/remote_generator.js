// Remote Generator Interface (v1.2)
// Interface for creating / managing remote configurations
// ******************************************************************
// -*- INPUTS -*-
// msg.payload.config       : RemoteInterface config object
// msg.payload.remote_id    : remote_id
// msg.payload.buttons      : button ids
// msg.payload.commands     : command ids
// msg.payload.actions      : action(s)

//
// -*- OUTPUTS -*-
// msg.payload              : RemoteInterface config object
// ******************************************************************

/*** START ***/
const utils = global.get("utils");

const config = new utils.RemoteInterface(global.get(msg.payload.global_id)) || "generic";
const remote_id = msg.payload.remote_id || "default";
let buttons = msg.payload.buttons;
let commands = msg.payload.commands;
const actions = msg.payload.actions || {};
let status = `Remote generated [${remote_id}]`;

// Error if no commands passed
if (!commands) {
    status = "[ERROR] Missing .commands property.";
    return [null, utils.status(status)];
}

// Error if no buttons or commands passed
if (!buttons ) {
    node.warn("[WARNING] Missing .buttons property, defaulting to [on]");
    buttons = "on";
}

buttons = utils.castToArray(buttons);
commands = utils.castToArray(commands);

// Create remote
const remote = new utils.Remote(remote_id);

buttons.forEach(buttonId => {
    const button = remote.addButton(buttonId);

    // Get actions for this button
    const button_actions = actions[`${buttonId}`] || {};
    Object.keys(button_actions).forEach(commandId => {

        const command = button.addCommand(commandId);
        if (button_actions.hasOwnProperty(commandId)) {
            command.action = button_actions[commandId];
        }
    });
});

// Add remote to config
config.setRemote(remote.getId(), remote);
// Return generated remote object
//msg.payload = config.getObject();
msg.payload = remote.getObject();
return [msg, utils.status(status)];
/*** END ***/

/*** HELPERS ***/