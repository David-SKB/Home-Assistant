/**  
 * Calculate Average State (v1.0)
 * Calculates the average state for an incoming array of entities.
 ******************************************************************
 * -*- INPUTS -*-
 * @param { string | object } payload   - entity Array
 * @param { object } [config]           - configuration object
 * @param { object } [config.attribute] - entity attribute to use
 * @param { object } [config.precision] - number of decimal places
 *
 * -*- OUTPUTS -*-
 * @param { number } payload            - average entity state
 ******************************************************************
 */
// Initialise variables
var entities                = msg.payload;
var attribute               = (typeof msg.config["attribute"] === 'undefined') ? "" : msg.config["attribute"];
var precision               = (typeof msg.config["precision"] === 'undefined') ? "" : msg.config["precision"];
var avgVal                  = 0;
var available_entities      = 0;
var unavailable_entities    = [];

//var strict = (typeof msg.data["strict"] === 'undefined') ? "" : msg.data["strict"];

// Check if multiple entitiesm have been passed and if not, cast to array to avoid errors / code duplication
if (!Array.isArray(entities)) entities = [entities];

var val;

// Sum values
for (let i = 0; i < entities.length; i++) {

    val = entities[i]['state'];

    // Ensure value is a number & available
    if (val != 'unavailable' && !isNaN(val) && attribute == "") {
        //log("included: " + val);
        avgVal += parseFloat(val);
        available_entities ++;

    } else {

        // Check attribute
        val = attributeFilter(entities[i]['attributes'], attribute);

        if (val){
            avgVal += parseFloat(val);
            available_entities++;
        }
        // bad entity/attribute? Log + add to unavailable entities list
        else {
            log("[ERROR] Invalid entity / attribute");
            unavailable_entities[-1] = entities[i];
        }
    }
}
//calculate average to xdp
avgVal = (avgVal / available_entities);
avgVal = round(avgVal, precision);

// Display Debug/Output log
log("avgVal: " + avgVal + " available_sensors: " + available_entities + " unavailable_sensors: " + unavailable_entities.length + " global_id: " + msg.global_id);

// Output unavailable sensors if any
if (unavailable_entities.length != 0) log(unavailable_entities);
msg.payload = avgVal;
return msg;

// Function to search for attribute within an entity : TODO
function attributeFilter(attributeObject, attribute) {

    // Check if attribute object exists otherwise return false
    if (attributeObject == ("" || undefined)) return false;

    // TODO: Get attribute depth - test on persistent_notification.invalid_config:
    var attributeParts = attribute.split(".");
    log("[DEBUG] Attribute Parts: " + attributeParts);

    var attrDepthObject = attributeObject;

   // Loop through each potential attribute level
    for (let i = 0; i < attributeParts.length; i++) {

        // Check whether key exists in attributes and return/search the value/object
        if (attrDepthObject[attributeParts[i]] != ("" || undefined)) {
            // Set attribute object to sub-object and repeat
            attrDepthObject = attrDepthObject[attributeParts[i]];
        }

    }
    log("Attribute Serach Result: " + attrDepthObject);

    // Return value if found
    if (attrDepthObject != ("" || undefined)) return attrDepthObject;

    // Otherwise return false
    return false;
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

/**
* node.warn wrapper for debugging
* @param {string | object} message
*/
function log(message) {
    // Print message if debug_flag is present
    if (msg.debug_flag || msg.payload.debug_flag) {
        node.warn(message);
    };
}