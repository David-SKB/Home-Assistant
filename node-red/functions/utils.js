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
    constructor(remoteId, buttons = []) {
        this.remoteId = remoteId;
        this.buttons = buttons;
    }

    addButton(buttonId, sourceButton = null) {
        const button = new Button(buttonId);
        if (sourceButton) {
            sourceButton.commands.forEach(sourceCommand => {
                button.addCommand(sourceCommand.commandId, sourceCommand);
            });
        }
        this.buttons.push(button);
        return button;
    }

    getId() {
        return this.remoteId;
    }

    getObject() {
        const remoteObject = {};
        this.buttons.forEach(button => {
            remoteObject[button.getId()] = button.getObject();
        });
        return remoteObject;
    }
}

class Button {
    constructor(buttonId, commands = []) {
        this.buttonId = buttonId;
        this.commands = commands;
    }

    addCommand(commandId, sourceCommand = null) {
        const command = new Command(commandId);
        if (sourceCommand) {
            // Copy properties from source command to new command
            command.action = { ...sourceCommand.action };
        }
        this.commands.push(command);
        return command;
    }

    getId() {
        return this.buttonId;
    }

    getObject() {
        const buttonObject = {};
        this.commands.forEach(command => {
            buttonObject[command.getId()] = command.getObject();
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
        return {
            action: { ...this.action }
        };
    }
}


class RemoteInterface {
    constructor(remoteConfig = {}) {
        this.remotes = remoteConfig.remotes || {};
    }

    setRemote(remoteId, sourceRemote = null) {
        if (sourceRemote instanceof Remote) {
            this.remotes[remoteId] = sourceRemote.getObject();
        } else if (sourceRemote) {
            if (!validateRemote(sourceRemote)) {
                throw new Error('Invalid remote configuration');
            }
            this.remotes[remoteId] = sourceRemote;
        } else {
            this.remotes[remoteId] = {
                buttons: {}
            };
        }
        return new Remote(remoteId, []);
    }

    setButton(remoteId, buttonId, sourceButton = null) {
        if (!this.remotes[remoteId]) {
            this.createRemote(remoteId);
        }
        if (sourceButton) {
            if (!validateButton(sourceButton)) {
                throw new Error('Invalid button configuration');
            }
            this.remotes[remoteId].buttons[buttonId] = sourceButton;
        } else {
            this.remotes[remoteId].buttons[buttonId] = {
                commands: {}
            };
        }
        return new Button(remoteId, buttonId);
    }

    setCommand(remoteId, buttonId, commandId, sourceCommand = null) {
        if (!this.remotes[remoteId]) {
            this.createRemote(remoteId);
        }
        if (!this.remotes[remoteId].buttons[buttonId]) {
            this.createButton(remoteId, buttonId);
        }
        if (sourceCommand) {
            if (!validateCommand(sourceCommand)) {
                throw new Error('Invalid command configuration');
            }
            this.remotes[remoteId].buttons[buttonId].commands[commandId] = sourceCommand;
        } else {
            this.remotes[remoteId].buttons[buttonId].commands[commandId] = {
                action: {}
            };
        }
        return new Command(buttonId, commandId);
    }

    getRemoteIds() {
        return Object.keys(this.remotes);
    }

    getButtonIds(remoteId) {
        if (this.remotes[remoteId]) {
            return Object.keys(this.remotes[remoteId].buttons);
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
    if (typeof remoteConfig !== 'object' || remoteConfig === null) {
        return false;
    }
    if (!remoteConfig.hasOwnProperty('buttons') || typeof remoteConfig.buttons !== 'object' || remoteConfig.buttons === null) {
        return false;
    }
    for (const buttonId in remoteConfig.buttons) {
        if (!remoteConfig.buttons.hasOwnProperty(buttonId)) {
            continue;
        }
        const buttonConfig = remoteConfig.buttons[buttonId];
        if (typeof buttonConfig !== 'object' || buttonConfig === null) {
            return false;
        }
        if (!buttonConfig.hasOwnProperty('commands') || typeof buttonConfig.commands !== 'object' || buttonConfig.commands === null) {
            return false;
        }
    }
    return true;
}

function validateButton(buttonConfig) {
    if (typeof buttonConfig !== 'object' || buttonConfig === null) {
        return false;
    }
    if (!buttonConfig.hasOwnProperty('commands') || typeof buttonConfig.commands !== 'object' || buttonConfig.commands === null) {
        return false;
    }
    return true;
}

function validateCommand(commandConfig) {
    if (typeof commandConfig !== 'object' || commandConfig === null) {
        return false;
    }
    // Add any specific validation logic for command configuration
    return true;
}

class DeviceManager {
    constructor(mapping = {}) {
        this.devices = mapping;
    }

    setDevice(device_id, remote_id) {
        this.devices[device_id] = remote_id;
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