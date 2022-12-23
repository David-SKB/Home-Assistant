//Time Conversion Routine v1.3
//This routine takes strings such as "5 Minutes" and converts into 
//a usable DT format (ms for now, might add more options later)
//milliseconds conversion
//Seconds | 1000
//Minutes | 60000
//
// Function Variables
var formattedTimeout    = 0;
var timeoutStr      = msg.payload.toString().split(" ");
//node.warn("timeoutStr: "+ timeoutStr);
var timeoutValue    = getValue(timeoutStr[0]);
//node.warn("timeoutValue: "+ timeoutValue);
var timeoutUnit     = getUnit(timeoutStr[1]);
//node.warn("timeoutUnit: "+ timeoutUnit);

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
    // (Low/Medium/High/"") defaulting to minutes
    formattedTimeout = timeoutValue * 1000;
}
//node.warn("formattedTimeout: "+ formattedTimeout);
msg.payload = formattedTimeout;
msg.timeout = true;
return msg;

// Unit Retrieval Function
function getUnit (unit){
    //node.warn("getUnit");
    if (unit == undefined){
        return "";
    }
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
function getValue (value){
    //node.warn("getValue");
  if (parseInt(value)){
    //node.warn("Integer value: " + value);  
    return parseInt(value)
  } else {
    // Likely a string value
    //node.warn("String value: " + value);
    var values = 
    {
      'low'     : '15',
      'medium'  : '30',
      'high'    : '60',
    };
    //node.warn(values[value.toLowerCase()]);
    return (values[value.toLowerCase()] || "");
  }
}
