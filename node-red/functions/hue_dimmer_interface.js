// Hue Dimmer Interface (v1.0)
// Interface for creating / managing hue dimmer remotes
// ******************************************************************
// -*- INPUTS -*-
// msg.payload              : current entity state value
// msg.global_id            : Global Context identifier / Entity ID
//
// -*- OUTPUTS -*-
// msg.payload              : global variable value
// msg.global_id            : Actual Global Context identifier
// ******************************************************************

/*** START ***/
const utils = global.get("utils");

const action = {};//tbc

const hue_dimmer_config = new utils.RemoteInterface();

// Display a json object with all the remote layouts
node.warn(hue_dimmer_config.getObject());

// Create default remote
const hue_dimmer_default = new utils.Remote("default");
const button_ids = ["on", "up", "down", "off"];
const command_ids = ["short_release", "double_press", "hold"];
button_ids.forEach(buttonId => {
    const button = hue_dimmer_default.addButton(buttonId);
    command_ids.forEach(commandId => {
        button.addCommand(commandId);
    });
});

// Display a json object of the remote and its buttons and commands
node.warn(hue_dimmer_default.getObject());

// Add remote to config
hue_dimmer_config.setRemote(hue_dimmer_default.getId(), hue_dimmer_default);

// Display a json object with all the updated remote layouts
node.warn(hue_dimmer_config.getObject());

return msg;
/*** END ***/

/*** HELPERS ***/
