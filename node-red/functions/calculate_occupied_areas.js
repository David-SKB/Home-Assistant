// Calculate Occupied Areas
// 
// ******************************************************************
// -*- INPUTS -*-
// msg.payload.areas                : key/value area_registry object
// msg.payload.entities             : key/value entity_registry object
// msg.payload.occupancy_timeout    : occupancy timeout value
//
// -*- OUTPUTS -*-
// msg.payload                      : areas object
// ******************************************************************

/*** START ***/
const utils = global.get("utils");
const occupancyTimeout = msg.payload.occupancy_timeout;

// Return if no system_occupancy_timeout present in input
if (!utils.exists(occupancyTimeout)){
    return [null, utils.status("missing occupancy_timeout property in payload")];
}

// Main logic to check area occupancy
let areas = msg.payload.areas;
const entities = msg.payload.entities;
var areasOccupied = 0;

// Check each area for occupancy
for (const areaId in areas) {

    const area = areas[areaId];
    area.occupied = isAreaOccupied(area, entities, occupancyTimeout);
    if (area.occupied.state) areasOccupied++;

}

// Return the result (areas object with an added "occupied" attribute and last_occupied object)
msg.payload = areas;

return [msg, utils.status(`[areas occupied: ${areasOccupied}]`)];
/*** END ***/


/*** HELPER FUNCTIONS ***/

// Helper function to check if an area is occupied
function isAreaOccupied(area, entities, occupancyTimeout) {

    // Call the function to get entities in areas
    const entitiesInArea = getEntitiesInArea(area, entities);

    for (const entity in entitiesInArea){

        var state = utils.currentState(entitiesInArea[entity].entity_id);
        if (state.state == "on") return {state: true, last_occupied: Date.now()};

        var lastChanged = utils.exists(state.last_changed) ? state.last_changed : state.last_updated;

        if (!utils.exists(lastChanged)) {
            
            node.warn("last_changed/updated not found, defaulting to current timestamp");
            lastChanged = Date.now();

        }
        
        lastChanged = new Date(lastChanged).getTime();
        const lastMotionTimeThreshold = Date.now() - occupancyTimeout;

        // Area is occupied
        if (lastChanged > lastMotionTimeThreshold) {

            return { state: true, last_occupied: updateLastOccupied(area, lastChanged) };

        };

    }
    
    return { state: false, last_occupied: updateLastOccupied(area, lastChanged) };

}

// Helper function to check if an entity is a binary sensor
function isBinarySensor(entity) {

    return entity.platform === "zha" && entity.entity_id.startsWith("binary_sensor.");

}

// Helper function to get all entities for each area
function getEntitiesInArea(area, entities) {

    const entitiesInArea = [];

    for (const entityId in entities) {

        if (isBinarySensor(entities[entityId]) && entities[entityId].area_id == area.id) {

            entitiesInArea.push(entities[entityId])
            
        }

    }

    return entitiesInArea;

}

// Helper function to update the last occupied zone
function updateLastOccupied(area, occupied) {

    // Set current value as last_occupied if it doesnt already exist
    if (!utils.exists(area.occupied) || !utils.exists(area.occupied.last_occupied)) return occupied;

    // Set current value as last_occupied if timestamp is more recent
    if (occupied > area.occupied.last_occupied) return occupied;

    return area.occupied.last_occupied;

}

function setLastOccupied(area, timestamp){

    global.set("system.occupancy.last_occupied", {area, timestamp});

}

function setLastOccupied2(area, timestamp) {

    area.occupied.last_occupied = timestamp;
    return area;

}