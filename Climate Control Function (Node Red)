//Climate Control Routine
// This routine determines wheter to turn your cooling device(s) on/off 
// based on incoming temperature data. Property of X.

//Sensor Variables
var tempValues      = flow.get(["temp1", "temp2", "temp3", "temp4"])
//var humidityValues  = flow.get(["hum1", "hum2", "hum3", "hum4"])

//Config Variables
var realAvgTemp = parseFloat(global.get("belcave_realavgtemp"));
var avgtemp     = global.get("belcave_avg_temp_ui")
var mode        = global.get("belcave_cc_mode")
var speed       = global.get("belcave_cc_speed")

//Function Variables
//var values          = flow.get(["realavgtemp", "avgtemp","mode","speed"])
var modeModifier    = 1;
var speedModifier   = 1;
var newMsg          = ''
var ccAction = ''
//var newMsg = { payload: msg.payload.length };

//Speed Setting
switch(speed) {
  case "Eco":
    // Eco
    speedModifier = parseFloat(1);
    break;
  case "420":
    // High
    speedModifier = parseFloat(0.420);
    break;
  default:
    // Normal
    speedModifier = parseFloat(0.69);
}
// Temperature Control Logic
var minTemp = avgtemp - speedModifier;
var maxTemp = avgtemp + speedModifier;
//Mode
switch(mode) {
  case "A/C":
    // Air Conditioning
    modeModifier = parseFloat(1);
    break;
  case "HEAT":
    // Heating
    modeModifier = parseFloat(0.420);
    break;
  case "FAN":
    // Fan
    modeModifier = parseFloat(0.420);
    break;
  case "AUTO":
    // Auto, heats and cools as needed, TBC
    modeModifier = parseFloat(0.420);
    break;
  default:
    // OFF/ERROR, TBC, LOG?
    modeModifier = parseFloat(0.69);
}
switch(true) {
  case realAvgTemp < minTemp:
    // Below Threshold
    ccAction = 'OFF'; //or HEAT - add functionality for heating? Not really needed tho SIKE
    break;
  case realAvgTemp > maxTemp:
    // Above Threshold
    ccAction = 'COOL';
    break;
  default:
    // Within Threshold / Exceptions
    ccAction = 'HOLD';
    break;
}
node.warn("speed: "+ speed);
node.warn("speedm: "+ speedModifier);
node.warn("MINT: "+ minTemp);
node.warn("MAXT: "+ maxTemp);
node.warn("realavgtemp: "+ realAvgTemp);

//End Temperature Control Logic
newMsg = { payload: ccAction }
flow.set("currentaction", ccAction);
return newMsg;
//Air Condititioning Function
function setSpeed(s, sM){
    //Speed Setting
switch(speed) {
  case "Eco":
    // Eco
    speedModifier = parseFloat(1);
    break;
  case "420":
    // High
    speedModifier = parseFloat(0.420);
    break;
  default:
    // Normal
    speedModifier = parseFloat(0.69);
}
   var one = Number(x);  //convert to a number
   var two = Number(y);  //convert to a number
   var result = one + two;
return result;
}
