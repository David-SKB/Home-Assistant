// Light Scheduler Function (v1.0)
// This routine takes schedule times and checks whether lights
// should be turned on/off
//
// Function Variables
var zone                = msg.zone;
var lightingZone        = global.get(msg.zone +'_lighting_zone');
var action              = '';
var currentDT           = new Date();
var scheduleStart       = global.get(zone + '_scheduled_lighting_start');
var scheduleStartValues = scheduleStart.split(":");
var scheduleEnd         = global.get(zone + '_scheduled_lighting_end');
var scheduleEndValues   = scheduleEnd.split(":");
//
var scheduleStartDate = new Date();
scheduleStartDate.setHours(scheduleStartValues[0]);
scheduleStartDate.setMinutes(scheduleStartValues[1]);
scheduleStartDate.setSeconds(scheduleStartValues[2]);
//
var scheduleEndDate = new Date();
scheduleEndDate.setHours(scheduleEndValues[0]);
scheduleEndDate.setMinutes(scheduleEndValues[1]);
scheduleEndDate.setSeconds(scheduleEndValues[2]);

// Crude validation, maybe build out a seperate framework?
if (scheduleStart == scheduleEnd){
    node.warn("[ERROR] Matching Lighting Schedule Start/End Times Found for ["+ zone +"]");
    return null;
}
// Main Processing
//
// Check direction of schedule start/end time
var direction = 'FORWARD';
if (scheduleStartDate > scheduleEndDate){
    direction = 'REVERSE'
}
// 
switch(direction) {
    case "FORWARD":
        //
        if (currentDT >= scheduleStartDate && currentDT <= scheduleEndDate){
            node.warn('ON'); 
            action = 'ON';
        } else {
            node.warn('OFF');
            action = 'OFF';
        }
        break;
      case "REVERSE":
        //
        if ((currentDT >= scheduleStartDate && currentDT >= scheduleEndDate) || (currentDT <= scheduleStartDate && currentDT <= scheduleEndDate)){
            node.warn('ON - REV'); 
            action = 'ON';
        } else {
            node.warn('OFF - REV');
            action = 'OFF';
        }
        break;
      default:
        // 
}
//node.warn("currentDT: "+ currentDT);
//node.warn("scheduleStartDate: "+ scheduleStartDate);
//node.warn("scheduleEndDate: "+ scheduleEndDate);
newMsg = { payload : action };
newMsg.lighting_zone = lightingZone;
//node.warn(newMsg);
return newMsg;