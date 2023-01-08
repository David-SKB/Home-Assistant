// Sun Rise / Set (v1.0)
//var lux                 = msg.config.lux;
var lux                 = global.get(msg.config.global_lux);
var lowerLuxThreshold   = exists(msg.config.lower_lux_threshold) ? msg.config.lower_lux_threshold : 2
var upperLuxThreshold   = global.get(msg.config.global_lux_mean);
msg.reset               = true;
var statusMsg           = {};
//var upperLuxThreshold = msg.config.upper_lux_threshold;

// Check if sun has risen
if (msg.payload == "above_horizon") {

    // Check if lux sensor(s) are present
    if (exists(lux)) {

        // Check if light level is above lower threshold
        if (lux >= lowerLuxThreshold) {

            // Sunrise (or artificial light) detected (maybe in the future check if motion lighting mode is active?)
            return [msg, null, status("Sunrise")];

        }
        
        // Sun is still rising, not enough light detected
        log ("[DEBUG] Sun is rising...");
        return [null, null, status("Sun is rising...")];

    }

    // No lux sensor(s), use sun state
    return [msg, null, status("Sunrise")];

} 

if (msg.payload == "below_horizon") {

    // Check if lux sensor(s) are present
    if (exists(lux)) {

        // Check if light level is below lower threshold or below average (if passed)
        if (lux < lowerLuxThreshold || (exists(upperLuxThreshold) && lux > upperLuxThreshold)) {

            // Sunset (insufficient/artificial light) detected
            return [null, msg, status("Sunset")];

        }

        // Sun is still setting, light still detected
        log("[DEBUG] upperLuxThreshold: " + upperLuxThreshold + " lux: " + lux);
        log("[DEBUG] Sun is setting...");
        return [null, null, status("Sun is setting...")];

    }

    // No lux sensor(s), use sun state
    return [null, msg, status("Sunset")];

}

// Potential change to integration?
log("[ERROR] Sun State: " + msg.payload);

return [null, null, status("[ERROR] Sun State: " + msg.payload)];

/**
 * Check if a value exists
 * @param {any} value
**/
function exists(value) {
    return value != ("" || undefined || null);
}

/**
 * node.warn wrapper for debugging
 * @param {string | object} message
**/
function log(message) {
    // Print message if debug_flag is present
    if (msg.debug_flag || msg.payload.debug_flag) {
        node.warn(message);
    };
}

/**
 * Wrapper for creating status msg object with a payload
 * @param {any} message
**/
function status(message) {
    // Create a new object and assign message to payload
    return {"payload":message};
}