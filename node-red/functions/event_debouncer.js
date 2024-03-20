// Event Debouncer (v1.3)
// Event Debounce Filter
// ******************************************************************
// -*- INPUTS -*-
// msg.payload              : Event data
// env.FILTER_ATTRIBUTES    : Array of attributes to use for filtering
// env.GLOBAL_ID            : debounce_timers Global Context ID
//
// -*- OUTPUTS -*-
// msg.payload              : Debounced event data
// ******************************************************************

/*** START ***/
const utils = global.get("utils");

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

// Create a new instance of DebounceTimerManager
const debounceManager = new utils.DebounceTimerManager();

// Set global context id for debounce_timers object
const global_id = env.get("GLOBAL_ID") || "debounce_timers";

// Retrieve filter attributes
const attributes_array = env.get("FILTER_ATTRIBUTES");
//const attributes_array = ["device_id", "command"];

// Store debounce timers for each combination of attribute values
var debounce_timers = global.get(global_id) || {};

// Define debounce time in milliseconds
const DEFAULT_DEBOUNCE_TIME_MS = 20;
var debounce_time = utils.exists(env.get("DEBOUNCE_TIME_MS")) ? env.get("DEBOUNCE_TIME_MS") : DEFAULT_DEBOUNCE_TIME_MS;

// Process incoming message
const callback = function () {
    // After debounce time, execute the downstream nodes with the last message
    global.set(global_id, debounce_timers);
    node.send(msg);
};

// Get attribute values from the event data
const eventAttributes = utils.getEventAttributes(msg.payload.event, attributes_array);

// Clear existing timer
debounceManager.clearTimer(
    eventAttributes,
    debounce_timers
);

// Create or update debounce timer
debounceManager.createTimer(
    eventAttributes,
    debounce_timers,
    callback,
    debounce_time
);
/*** END ***/