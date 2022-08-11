//Time Conversion Routine (v1.4)
//This routine takes strings such as "5 Minutes" and converts into 
//a usable DT format (ms for now, might add more options later)

// Function Variables
var timeoutStr      = msg.payload.split(" ");
var timeoutValue    = parseInt(timeoutStr[0], 10);
var timeoutUnit     = getUnit(timeoutStr[1]);

// Function Variables
var formattedTimeout    = 0;
//var newMsg = { payload: msg.payload.length };

// Conversion
switch(timeoutUnit) {
  case "S":
    // Seconds
    formattedTimeout = timeoutValue * 1000;
    break;
  case "M":
    // Minutes
    formattedTimeout = timeoutValue * 60000;
    break;
  case "H":
    // Hours
    formattedTimeout = timeoutValue * 3600000;
    break;
  default:
    // ERROR, LOG?
    node.warn("Invalid Unit : "+ timeoutUnit);
}
node.warn("timeoutStr: "+ timeoutStr);
node.warn("timeoutValue: "+ timeoutValue);
node.warn("timeoutUnit: "+ timeoutUnit);

newMsg = { delay : formattedTimeout }
newMsg.payload = "STOP";
//flow.set("currentaction", ccAction);
return newMsg;

// Unit Retrieval Function (TODO: simplify)
function getUnit (unit){
  var units = 
  {
    'seconds'   : 'S',
    'second'    : 'S',
    'minutes'   : 'M',
    'minute'    : 'M',
    'hours'     : 'H',
    'hour'      : 'H'
  };
  return (units[unit.toLowerCase()] || "");
}