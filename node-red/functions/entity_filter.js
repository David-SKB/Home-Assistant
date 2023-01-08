// Filters entities based on gives criteria
// property of X.

var entity_list   = msg.payload;
var entity_areas  = (typeof msg.data["area"] === 'undefined') ? "" : msg.data["area"];
var entity_types  = (typeof msg.data["type"] === 'undefined') ? "" : msg.data["type"];
var entity_keys   = (typeof msg.data["key"] === 'undefined') ? "" : msg.data["key"];
var exclusions    = (typeof msg.data["exclude"] === 'undefined') ? "" : msg.data["exclude"];
var strict        = (typeof msg.data["strict"] === 'undefined') ? "" : msg.data["strict"]; // determines wheter all conditions must be met

// Check if multiple items for each parameter has been passed and cast to array to avoid code duplication
if (!Array.isArray(entity_types)) entity_types = [entity_types];
if (!Array.isArray(entity_areas)) entity_areas = [entity_areas];
if (!Array.isArray(entity_keys)) entity_keys   = [entity_keys];
if (!Array.isArray(exclusions)) exclusions     = [exclusions];

//Check for missing period in entity types (e.g. sensor.)
for (let i = 0; i < entity_types.length; i++){

  if (entity_types[i].charAt(entity_types[i].length - 1) !== ".") {
    entity_types[i] = entity_types[i] + ".";
  }

}
//Display current entity list [DEBUG]
//node.warn(entity_list);

// Check conditions
const matches = entity_list.filter(element => {

  // Filter by entity type(s)
  if (entity_types != "" && !entityFilter(element["entity_id"], entity_types, strict["type"])) {
    return false;
  } else {
  }

  // Filter by entity key(s)
  if (entity_keys != "" && !entityFilter(element["entity_id"], entity_keys, strict["key"])) {
    return false;
  } else {
  }

  // Filter by entity area(s)
  if (entity_areas != "" && !entityFilter(element["entity_id"], entity_areas, strict["type"])) {
    return false;
  } else {
  }

  // Filter by exclusion(s)
  if (exclusions != "" && entityFilter(element["entity_id"], exclusions, strict["exclusion"])) {
    return false;
  }
  return true;
});

// Display results [DEBUG]
if (matches.length > 0) {
  node.warn('Type(s): [' + entity_types + '], Area(s): [' + entity_areas + '], Key(s): [' + entity_keys + '], Exclusion(s) [' + exclusions + '], Entities Found: ' + matches.length);
    // Filtered list
    node.warn(matches);
} else {
  node.warn('[NO MATCHES FOUND] Type(s): [' + entity_types + '], Area(s): [' + entity_areas + '], Key(s): [' + entity_keys + '], Exclusion(s) [' + exclusions + ']');
}
// Return matches in msg.payload
msg.payload = matches;
return msg;

function entityFilter(entity_id, comparators, strict) {

  var found = false;

  // Check whether each comparator is in entity_id
  for (let i = 0; i < comparators.length; i++) {

    // Item not found (or empty for some reason, maybe missing array element? Not expected though so check last)
    if (entity_id.indexOf(comparators[i]) === -1 && comparators[i] != "") {

      // return false if any comparator isn't found (and strict)
      found = false;
      if (strict) return found;

    } else {

      // no need to keep searching if item found (and not strict)
      found = true;
      if (!strict) return found;

    }
  }
  return found;
}