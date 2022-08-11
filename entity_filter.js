// Filters entities based on gives criteria, (v1.0) [WIP]
// property of X.
node.warn(msg)
var entity_list = msg.payload;
var entity_area = msg.area;
var entity_type = msg.type;
var entity_key  = (typeof msg.key === 'undefined') ? "" : msg.key;
var exclusion   = (typeof msg.exclude === 'undefined') ? "" : msg.exclude;
node.warn('exclusion: ' + msg.exclude);
//Display current entity list [DEBUG]
node.warn(entity_list);

// Check conditions
const matches = entity_list.filter(element => {
    var res = true;
    //Check if area is not in entity id
    if (element["entity_id"].indexOf(entity_area) === -1) {
    return false;
  }
  // Check if key is not in entity id
  if (element["entity_id"].indexOf(entity_key) === -1) {
    return false;
  }
  // Filter by exclusion 
  if (element["entity_id"].indexOf(exclusion) !== -1) {
    // exclusion detected, remove
    return false;
  }
  
  // Filter by entity type (already done before get entities call via rule mapper)
  //if (element["entity_id"].indexOf(entity_type) !== -1) {
    //return true;
  //} else {
    //  return false;
  //}
  return true;
});
// Display results [DEBUG]
if (matches.length > 0) {
    node.warn('Area: ' + entity_area + ', Type: ' + entity_type + ', Key: ' + entity_key + ', Entities Found: ' + matches.length);
    // Filtered list
    node.warn(matches);
} else {
    node.warn('[NO MATCHES FOUND] Area: ' + entity_area + ', Type: ' + entity_type + ', Key: ' + entity_key);
}
// Return matches in msg.payload
msg.payload = matches;
return msg;