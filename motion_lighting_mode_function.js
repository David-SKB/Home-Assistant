// Motion Lighting Mode Function (v1.1)
// Returns the zone entity id(s) for lights to turn on/off
//
// Required globals/helper entities
// area_motion_lighting_mode
// area_motion_lighting_zone
// area_motion_timeout
//
// Mode specific globals/helper entities
// area_hybrid_lighting_zone_1
// area_hybrid_lighting_zone_2
//
//
// Function Variables
var area                = msg.area;
var motion              = msg.motion;
var motionLightingMode  = global.get(area +"_motion_lighting_mode");
//
newMsg      = getZone(area, motionLightingMode);
newMsg.mode = motionLightingMode;
//node.warn("motion: "+ motion);
//node.warn("motionLightingMode: "+ motionLightingMode);
//
if (motion == "off"){
    newMsg.delay = global.get(area +"_motion_timeout");
    //node.warn("newMsg:");
    //node.warn(newMsg);
    return [null, newMsg];
}
//node.warn("newMsg:");
newMsg.reset = true;
//node.warn(newMsg);
return [newMsg, null];
//END//
function getZone (area, mode){
    // Mode Switch
    switch(mode) {
      case "TOGGLE","DIM":
        //
        return motionZoneToggle(area);
      case "HYBRID":
        //
        return motionZoneHybrid(area);
      default:
        // Not developed yet? Default to TOGGLE
        return motionZoneToggle(area);
    }
}
//
// TOGGLE Lighting Function
//
function motionZoneToggle (area){
  var motionLightingZone  = global.get(area +"_motion_lighting_zone");
  //
  node.warn("motionLightingZone: "+ motionLightingZone);
  //
  newMsg        = { payload : motionLightingZone };
  newMsg.area   = area;
  newMsg.mode   = motionLightingMode;
  return newMsg;
}
//
// HYBRID Lighting Function
//
function motionZoneHybrid (area){
  var hybridLightingZone1 = global.get(area +"_hybrid_lighting_zone_1");
  var hybridLightingZone2 = global.get(area +"_hybrid_lighting_zone_2");
  //
  //node.warn("hybridLightingZone1: "+ hybridLightingZone1);
  //node.warn("hybridLightingZone2: "+ hybridLightingZone2);
  //var payload = hybridLightingZone1 +','+ hybridLightingZone2;
  //node.warn("payload: "+ payload);
  //
  newMsg            = { payload1 : hybridLightingZone1 };
  newMsg.payload2   = hybridLightingZone2;
  newMsg.area       = area;
  return newMsg;
}