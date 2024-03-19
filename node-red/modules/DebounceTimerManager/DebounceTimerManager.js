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