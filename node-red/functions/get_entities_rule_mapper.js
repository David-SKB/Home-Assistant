//Maps Entity Type to pass into get entities node (v1.0)
//property of X.

var entity_type = msg.type;
//var entity_area = msg.area;

//Check for missing period
if (entity_type.charAt(entity_type.length - 1) !== ".") {
    entity_type = entity_type + ".";
}
//create rule object for get entities override
var rule = {
    property: "entity_id",
    logic: "starts_with",
    value: entity_type,
    valueType: "str"
};
//map rule to input array
//var rule_array = [rule]
msg.payload = { "rules": [rule] }
//
//node.warn("payload obj");
//node.warn(msg.payload);
//
return msg;