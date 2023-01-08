// Calculates the average light level to try and get an idea of
// when artifical light is in use against sunset/sunrise.
var sensorHistory = msg.payload;
var runningTotal = 0;
var unavailableElements = 0;

sensorHistory.forEach(function(element) {
    //node.warn(element);
    if (element.state != "unavailable") {
        runningTotal += parseFloat(element.state);
    } else {
        log(element);
        unavailableElements++;
    }

});
log(msg.entity_id);
log("total: " + runningTotal + " unavailable: " + unavailableElements);
var mean = runningTotal / (sensorHistory.length - unavailableElements);
log("mean: " + mean);

// Get the mean of all values below the mean, may be useful for detecting dimming
var subRunningTotal = 0;
var subMean = 0;
var subCount = 0;

sensorHistory.forEach(function (element) {
    if (parseFloat(element.state) < mean) {
        subRunningTotal += parseFloat(element.state);
        subCount++;
    }
});
subMean = subRunningTotal / subCount;
log("sub mean: " + subMean);
msg.payload = round(mean, 1);
return msg;

/**
* Rounding function
* @param {number} value
* @param {number} precision
*/
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