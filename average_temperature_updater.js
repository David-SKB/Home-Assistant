//Average Temperature Updater (1.0)
// This routine updates the average temperature helper entity for
// an area based on an incoming array of sensor entities

//Function Variables
//var values          = flow.get(["realavgtemp", "avgtemp","mode","speed"])
//node.warn("sensors: "+ result);
//var tempValues      = flow.get(["temp1", "temp2", "temp3", "temp4"])
//var realAvgTemp = parseFloat(global.get("belcave_realavgtemp"));
//Sensor Variables
var entities = msg.payload;
var avgTemp = 0;
var available_sensors = 0;
//
for (let i = 0; i < entities.length; i++) {
    var temp = entities[i]['state'];
    // Ensure temp is a number / available
    if (temp != 'unavailable' && !isNaN(temp)) {
        //node.warn("included: " + temp);
        avgTemp += parseFloat(temp);
        available_sensors ++;
    }
}
avgTemp = avgTemp / available_sensors;
node.warn("avgTemp: " + avgTemp, " available_sensors: " + available_sensors);

msg.payload = avgTemp;
// done in call service node
//newMsg = { global_id: 'average_' + area + '_temperature' };
node.warn(msg);
return msg;