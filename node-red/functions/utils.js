// Simple Utility Functions

// Default to utils object if no UTIL_GC environment variable passed
var utilGlobalContext = exists(env.get("UTIL_GC")) ? env.get("UTIL_GC") : "utils";
var objectID = append(utilGlobalContext, ".");

/** Utility Functions **/

// For testing / debugging purposes
function helloWorld () {
    
    var result = "Hello World";
    node.warn(node.caller);
    return result;

}

// Rounding function with precision
function round(value, precision) {

    // Return raw value if no precision passed
    if (!exists(precision)) return value;

    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

// Check if entity_id was passed, and remove domain
function getGlobalID(globalID) {

    // If an entity_id was passed, remove domain
    if (exists(globalID) && globalID.includes(".")) {

        globalID = globalID.split(".")[1];

    }

    // Return global ID
    return globalID;
}

// Check if a value exists
function exists(value) {

    var valueType = typeof value;

    // Check for empty string
    if (valueType === "string") {
        if (value == "" || (value.length == 0)) return false;
    }

    // null check
    if (value === null) return false;

    // undefined check
    if (valueType === "undefined") return false;

    // Empty object check
    if (valueType == "object") {
        if (Object.keys(value).length === 0) return false;
    }

    //return value != ("" || undefined || null || (value.length == 0));
    return true;

}

// Create a new object and assign message to payload
function status(message) {

    return { "payload": message };

}

// Sets an object attribute to a given value
function setAttribute (property, attribute, value) {
    
    // Check if msg property is an object
    if (!(typeof property === 'object')) {
        property = {};
    }
    
    // If attribute not passed, default to payload
    if (!exists(attribute)) {
        attribute = "payload";
    }

    // Set value
    property[attribute] = value;

    return property;

}

// Append character to end of string if not present
function append(value, character) {

    // Check if end of string matches character
    if (value.charAt(value.length - character.length) !== character) {

        // Append character if not found
        value = value + character;
    }

    return value;

}

// Remove character from end of string
function abate(value, character) {

    // Check if end of string matches character(s) 
    if (value.charAt(value.length - character.length) === character) {

        // Abate character if found
        value = value.substring(0, value.length - character.length);
    }

    return value;

}

// Cast Object to array
function castToArray(value) {
    return (Array.isArray(value)) ? value : [value];
}

// Function to get attribute values from event data
function getEventAttributes(event, attributes) {
    return attributes.map(attr => event[attr]);
}

function createResponseObject(response_code, message) {
    return {
        "response_code": response_code,
        "data": message
    }
}

function generateToggleSwitchValueTemplate(toggleEntityId, triggerEntityId, triggerEntityState) {
    return `{% if is_state('${toggleEntityId}', 'on') %}
        {{ is_state('${triggerEntityId}', '${triggerEntityState}') }}
        {% else %}
        {{ is_state('${toggleEntityId}', 'on') }}
        {% endif %}`;
}

function generateTemplateSwitchObject(switchId, friendlyName, valueTemplate, turnOnAction, turnOffAction, iconTemplate) {
    const switchObject = {
        [switchId]: {
            friendly_name: friendlyName,
            value_template: valueTemplate,
            turn_on: [turnOnAction],
            turn_off: [turnOffAction],
            icon_template: iconTemplate
        }
    };
    return switchObject;
}

function generateYamlTemplateObject(entity_type) {
    const yamlObject = {
        platform: 'template',
        [entity_type]: {}
    };
    return [yamlObject];
}

function addEntityToTemplateObject(yamlObject, entity_type, entity) {
    yamlObject[0][entity_type] = {
        ...yamlObject[0][entity_type],
        ...entity
    };
    return yamlObject;
}

function createTurnOnOffObject(service, data = {}) {
    return {
        turn_on: [
            {
                service: service,
                ...data.turn_on // Spread additional turn_on data if provided
            }
        ],
        turn_off: [
            {
                service: service,
                ...data.turn_off // Spread additional turn_off data if provided
            }
        ]
    };
}

function createIconTemplate(onStateIcon, offStateIcon = null, triggerEntityId = null, triggerEntityState = null) {
    if (!offStateIcon) {
        return `mdi:${onStateIcon}`;
    } else {
        return `{% if is_state('${triggerEntityId}', '${triggerEntityState}') %}
            mdi:${onStateIcon}
        {% else %}
            mdi:${offStateIcon}
        {% endif %}`;
    }
}

function getFileNameFromPath(filePath) {
    const parts = filePath.split('/');
    return parts[parts.length - 1];
}

function mapArrayToDict(entities, key) {
    const entityDict = {};

    entities.forEach(entity => {
        entityDict[entity[key]] = entity;
    });

    return entityDict;
}

function currentState(entityId) {
    return global.get("homeassistant.homeAssistant.states")[entityId];
}

class Remote {
    constructor(remoteId, buttons = {}) {
        this.remoteId = remoteId;
        this.buttons = {};

        // Check if buttons is an instance of Remote, if not, convert each entry to a Button instance
        if (!(buttons instanceof Remote)) {
            for (const buttonId in buttons) {
                if (buttons.hasOwnProperty(buttonId)) {
                    this.addButton(buttonId, buttons[buttonId]);
                }
            }
        }
    }

    addButton(buttonId, sourceButton = null) {
        const button = sourceButton instanceof Button ? sourceButton : new Button(buttonId, sourceButton);
        this.buttons[buttonId] = button;
        return button;
    }

    getId() {
        return this.remoteId;
    }

    getObject() {
        const remoteObject = {};
        Object.keys(this.buttons).forEach(buttonId => {
            remoteObject[buttonId] = this.buttons[buttonId].getObject();
        });
        return remoteObject;
    }
}

class Button {
    constructor(buttonId, commands = {}) {
        this.buttonId = buttonId;
        this.commands = {};

        // Check if commands is an instance of Button, if not, convert each entry to a Command instance
        if (!(commands instanceof Button)) {
            for (const commandId in commands) {
                if (commands.hasOwnProperty(commandId)) {
                    this.addCommand(commandId, commands[commandId]);
                }
            }
        }
    }

    addCommand(commandId, sourceCommand = null) {
        const command = sourceCommand instanceof Command ? sourceCommand : new Command(commandId, sourceCommand);
        this.commands[commandId] = command;
        return command;
    }

    getId() {
        return this.buttonId;
    }

    getObject() {
        const buttonObject = {};
        Object.keys(this.commands).forEach(commandId => {
            buttonObject[commandId] = this.commands[commandId].getObject();
        });
        return buttonObject;
    }
}

class Command {
    constructor(commandId, action = {}) {
        this.commandId = commandId;
        this.action = action;
    }

    getId() {
        return this.commandId;
    }

    getObject() {
        return this.action;
    }
}


class RemoteInterface {
    constructor(remoteConfig = {}) {
        this.remotes = {};
        if (remoteConfig instanceof Remote) {
            this.setRemote(remoteConfig.getId(), remoteConfig);
        } else {
            const remotes = remoteConfig.remotes || {};
            Object.keys(remotes).forEach(remoteId => {
                this.setRemote(remoteId, remotes[remoteId]);
            });
        }
    }


    setRemote(remoteId, sourceRemote = null) {
        if (sourceRemote instanceof Remote) {
            this.remotes[remoteId] = sourceRemote;
        } else if (sourceRemote) {

            if (!validateRemote(sourceRemote)) {
                throw new Error('Invalid remote configuration');
            }
            this.remotes[remoteId] = new Remote(remoteId, sourceRemote);
        } else {
            this.remotes[remoteId] = new Remote(remoteId);
        }
        return this.remotes[remoteId];
    }

    setButton(remoteId, buttonId, sourceButton = null) {
        if (!this.remotes[remoteId]) {
            this.setRemote(remoteId); // Ensure remote exists before setting button
        }
        const button = this.remotes[remoteId].addButton(buttonId, sourceButton);
        return button;
    }


    setCommand(remoteId, buttonId, commandId, sourceCommand = null) {
        if (!this.remotes[remoteId]) {
            this.setRemote(remoteId);
        }
        if (!this.remotes[remoteId].buttons[buttonId]) {
            this.setButton(remoteId, buttonId);
        }
        const button = this.remotes[remoteId].buttons[buttonId];
        const command = button.addCommand(commandId, sourceCommand);
        return command;
    }

    getCommand(remoteId, buttonId, commandId) {
        const remote = this.remotes[remoteId];

        if (!remote) {
            throw new Error(`Remote not found for ID ${remoteId}`);
        }

        const button = remote.buttons[buttonId];
        if (!button) {
            throw new Error(`Button not found for ID ${buttonId}`);
        }

        const command = button.commands[commandId];
        if (!command) {
            throw new Error(`Command not found for ID ${commandId}`);
        }

        return command;
    }

    getRemoteIds() {
        return Object.keys(this.remotes);
    }

    // Ignore this, it's for debugging
    getButtonIds2(remoteId) {
        if (this.remotes[remoteId]) {
            return Object.keys(this.remotes[remoteId].buttons);
        }
        return [];
    }

    getButtonIds(remoteId) {
        if (this.remotes[remoteId]) {
            if (this.remotes[remoteId] instanceof Button) {
                // If the value is an instance of Button, return its ID
                return [this.remotes[remoteId].getId()];
            } else {
                // Otherwise, assume it's an object with button IDs as keys
                return Object.keys(this.remotes[remoteId]);
            }
        }
        return [];
    }

    getCommandIds(remoteId, buttonId) {
        if (this.remotes[remoteId] && this.remotes[remoteId].buttons[buttonId]) {
            return Object.keys(this.remotes[remoteId].buttons[buttonId].commands);
        }
        return [];
    }

    getObject() {
        return {
            remotes: this.remotes
        };
    }
}

// Validation functions
function validateRemote(remoteConfig) {
    if (remoteConfig instanceof Remote) {
        // If remoteConfig is already an instance of Remote, it's valid
        return true;
    } else if (typeof remoteConfig === 'object' && remoteConfig !== null) {
        const remoteInstance = new Remote('remoteId');

        // Iterate over each button in the remote
        Object.keys(remoteConfig).forEach(buttonId => {
            const commandConfigs = remoteConfig[buttonId];
            const buttonInstance = new Button(buttonId);

            // Iterate over each command in the button
            Object.keys(commandConfigs).forEach(commandId => {
                const commandInstance = new Command(commandId, commandConfigs[commandId]);

                // Add the command to the button
                buttonInstance.addCommand(commandId, commandInstance);
            });

            // Add the button to the remote
            remoteInstance.addButton(buttonId, buttonInstance);
        });

        // Validate the remote instance
        const isValid = validateRemote(remoteInstance);
        return isValid;
    } else {
        return false; // Invalid remote configuration
    }
}



function validateButton(buttonConfig) {
    if (buttonConfig instanceof Button) {
        // If buttonConfig is an instance of Button class, we'll validate its commands
        for (const commandId in buttonConfig.commands) {
            if (!buttonConfig.commands.hasOwnProperty(commandId)) {
                continue;
            }
            const command = buttonConfig.commands[commandId];
            if (!(command instanceof Command)) {
                return false; // Invalid command within the button
            }
            // Optionally, add specific validation logic for command configuration here
        }
        return true; // All checks passed
    } else if (typeof buttonConfig === 'object' && buttonConfig !== null && buttonConfig.hasOwnProperty('commands')) {
        // If buttonConfig is an object representation, we'll recursively call validateCommand for each command
        for (const commandId in buttonConfig.commands) {
            if (!buttonConfig.commands.hasOwnProperty(commandId)) {
                continue;
            }
            if (!validateCommand(buttonConfig.commands[commandId])) {
                return false; // Invalid command configuration
            }
        }
        return true; // All checks passed
    } else {
        return false; // Invalid button configuration
    }
}

function validateCommand(commandConfig) {
    if (commandConfig instanceof Command) {
        // If commandConfig is an instance of Command class, it's valid
        return true;
    } else if (typeof commandConfig === 'object' && commandConfig !== null) {
        // If commandConfig is an object representation, we'll check its properties
        if (commandConfig.hasOwnProperty('commandId') && commandConfig.hasOwnProperty('action')) {
            // Optionally, add specific validation logic for command configuration here
            return true; // All checks passed
        }
    }
    return false; // Invalid command configuration
}

class DeviceManager {
    constructor(mapping = {}) {
        this.devices = mapping;
    }

    setDevice(device_id, data) {
        this.devices[device_id] = data;
    }

    getDevice(device_id) {
        return this.devices[device_id];
    }

    removeDevice(device_id) {
        if (this.devices.hasOwnProperty(device_id)) {
            delete this.devices[device_id];
        }
    }

    getDevices() {
        return this.devices;
    }
}

class DebounceTimerManager {
    constructor() {
        this.timers = {};
    }

    createTimer(attributeValues, debounceTimers, callback, delay) {
        let nestedObject = debounceTimers;
        for (const attrValue of attributeValues) {
            nestedObject[attrValue] = nestedObject[attrValue] || {};
            nestedObject = nestedObject[attrValue];
        }
        if (!nestedObject.hasOwnProperty('timer')) {
            nestedObject.timer = setTimeout(callback, delay);
        }
    }

    updateTimer(attributeValues, debounceTimers, callback, delay) {
        this.clearTimer(attributeValues, debounceTimers);
        this.createTimer(attributeValues, debounceTimers, callback, delay);
    }

    clearTimer(attributeValues, debounceTimers) {
        let nestedObject = debounceTimers;
        for (const attrValue of attributeValues) {
            if (!nestedObject[attrValue]) {
                return;
            }
            nestedObject = nestedObject[attrValue];
        }
        if (nestedObject.timer) {
            clearTimeout(nestedObject.timer);
            delete nestedObject.timer;
        }
    }
}

// General
global.set(objectID + "helloWorld", helloWorld);
global.set(objectID + "round", round);
global.set(objectID + "getGlobalID", getGlobalID);
global.set(objectID + "exists", exists);
global.set(objectID + "status", status);
global.set(objectID + "setAttribute", setAttribute);
global.set(objectID + "append", append);
global.set(objectID + "abate", abate);
global.set(objectID + "getFileNameFromPath", getFileNameFromPath);
global.set(objectID + "mapArrayToDict", mapArrayToDict);
global.set(objectID + "currentState", currentState);
global.set(objectID + "castToArray", castToArray);
global.set(objectID + "getEventAttributes", getEventAttributes);

// API
global.set(objectID + "createResponseObject", createResponseObject);

// .yaml template generation
global.set(objectID + "generateToggleSwitchValueTemplate", generateToggleSwitchValueTemplate);
global.set(objectID + "generateTemplateSwitchObject", generateTemplateSwitchObject);
global.set(objectID + "generateYamlTemplateObject", generateYamlTemplateObject);
global.set(objectID + "addEntityToTemplateObject", addEntityToTemplateObject);
global.set(objectID + "createTurnOnOffObject", createTurnOnOffObject);
global.set(objectID + "createIconTemplate", createIconTemplate);

// RemoteInterface
global.set(objectID + "RemoteInterface", RemoteInterface);
global.set(objectID + "Remote", Remote);
global.set(objectID + "Button", Button);
global.set(objectID + "Command", Command);

// Device Manager
global.set(objectID + "DeviceManager", DeviceManager);

// DebounceTimerManager
global.set(objectID + "DebounceTimerManager", DebounceTimerManager);

var loaded = false;
var gc = global.keys();

// Check if util objet is loaded
for (let i = 0; i < gc.length; i++) {

    if (gc[i] === utilGlobalContext) loaded = true;

}

// Return loaded status
if (loaded) return status("Utility Functions Loaded [" + utilGlobalContext + "]");

// Return non-loaded status
return status("Utility Functions Not loaded [" + utilGlobalContext + "]");