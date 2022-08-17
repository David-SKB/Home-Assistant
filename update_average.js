//Average Value Updater
// This routine updates an average (temp/hum) helper entity for
// an area based on an incoming array of sensor entities

//Sensor Variables
var entities            = msg.payload;
var avgVal              = 0;
var available_sensors   = 0;
var unavailable_sensors = [];
var entity_areas        = (typeof msg.data["area"] === 'undefined') ? "" : msg.data["area"];
var entity_attributes   = (typeof msg.data["attributes"] === 'undefined') ? "" : msg.data["attributes"];
//var strict = (typeof msg.data["strict"] === 'undefined') ? "" : msg.data["strict"];

// Check if multiple items for each parameter has been passed and cast to array to avoid code duplication
if (!Array.isArray(entity_attributes)) entity_attributes    = [entity_attributes];
if (!Array.isArray(entity_areas)) entity_areas              = [entity_areas];

// add up values
for (let i = 0; i < entities.length; i++) {

    var val = entities[i]['state'];

    // Ensure val is a number / available
    if (val != 'unavailable' && !isNaN(val)) {
        //node.warn("included: " + val);
        avgVal += parseFloat(val);
        available_sensors ++;

    } else {

        // Check attributes
        val = attributeFilter(entities[i]['attributes'], entity_attributes);

        if (val){
            //node.warn("attribute val found:" + val);
            avgVal += parseFloat(val);
            available_sensors++;
        }
        // bad entity? Log
        else {
            unavailable_sensors[-1] = entities[i];
        }
    }
}
//calculate average to 1dp
avgVal = Math.round( (avgVal / available_sensors) * 10) / 10;

// Display Debug/Output log
node.warn("avgVal: " + avgVal + " available_sensors: " + available_sensors + " unavailable_sensors: " + unavailable_sensors.length + " global_id: " + msg.global_id);
// Output unavailable sensors if any
if (unavailable_sensors.length != 0) node.warn(unavailable_sensors);
msg.payload = avgVal;
return msg;

// Function to search for attribte(s) within an entity
function attributeFilter(attributes, comparators) {

   //loop through each potential attribute key
    for (let i = 0; i < comparators.length; i++) {

        // Check whether a key exists in attributes and return the value
        if (attributes != "" && comparators[i] in attributes) return attributes[comparators[i]];

    }
    //otherwise return false
    return false;
}