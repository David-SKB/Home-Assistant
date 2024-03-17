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

// Return if no occupancy_timeout present in payload
if (!utils.exists(occupancyTimeout)){

    return [null, utils.status("missing occupancy_timeout property in payload")];

}

// Main logic to check area occupancy
let occupancy = msg.payload.occupancy;
let areas = msg.payload.areas;
const entities = msg.payload.entities;
let areasOccupied = 0;

// Calculate occupancy for each area
for (const areaId in areas) {
    
    const area = areas[areaId];
    area.occupied = isAreaOccupied(area, entities, occupancyTimeout);
    if (area.occupied.state) areasOccupied++;

    // Update occupied object within occupancy object
    occupancy.occupied = setOccupied(occupancy.occupied, area.occupied.last_occupied, occupancyTimeout);
    
    // Check if the current area is the last_occupied and set the area_id
    if (occupancy.occupied.last_occupied == area.occupied.last_occupied) occupancy.occupied.area_id = area.id;
    
}

occupancy.areas = areas;

// Return the resulting occupancy object
msg.payload = occupancy;
return [msg, utils.status(`[areas occupied: ${areasOccupied}]`)];
/*** END ***/


/*** HELPERS ***/

// Helper function to check if an area is occupied
function isAreaOccupied(area, entities, occupancyTimeout) {

    // Call the function to get entities in areas
    const entitiesInArea = getEntitiesInArea(area, entities);

    for (const entity in entitiesInArea){

        let state = utils.currentState(entitiesInArea[entity].entity_id);
        if (state.state == "on") return {state: true, last_occupied: Date.now()};
        let lastChanged = utils.exists(state.last_changed) ? state.last_changed : state.last_updated;
        return setOccupied(area.occupied, lastChanged, occupancyTimeout);

    }

    return setOccupied(area.occupied, null, occupancyTimeout);
    //return { state: false, last_occupied: updateLastOccupied(area.occupied, lastChanged) };

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

// Helper function to update the occupied object
function setOccupied(occupied, lastChanged, timeout) {
    
    const lastMotionTimeThreshold = Date.now() - timeout;

    if (utils.exists(lastChanged)) lastChanged = new Date(lastChanged).getTime();

    // Create occupied object if it doesnt exist
    if (!utils.exists(occupied)) {

        occupied = {
            state: false,
            last_occupied:lastChanged
        };

    }

    occupied.last_updated = Date.now();

    // Set occupied state if within threshold
    if (utils.exists(lastChanged) && (lastChanged > lastMotionTimeThreshold)) {
        
        occupied.state = true;
        occupied.last_occupied = lastChanged;

    }

    return occupied;

}