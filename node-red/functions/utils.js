// Commonly used Utility Functions

// Default to utils object if no UTIL_GC environment variable passed
var utilGlobalContext = exists(env.get("UTIL_GC")) ? env.get("UTIL_GC") : "utils";
var objectID = append(utilGlobalContext, ".");

global.set(objectID + "helloWorld", helloWorld);
global.set(objectID + "round", round);
global.set(objectID + "getGlobalID", getGlobalID);
global.set(objectID + "exists", exists);
global.set(objectID + "status", status);
global.set(objectID + "setAttribute", setAttribute);
global.set(objectID + "append", append);
global.set(objectID + "abate", abate);
//global.set(objectID + "getGlobalID", round);
//global.set(objectID + "getGlobalID", round);
//global.set(objectID + "getGlobalID", round);

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
    if (valueType === null) return false;

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