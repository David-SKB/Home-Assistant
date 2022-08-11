//Average Humidity Updater (1.0)
// This routine updates the average humidity helper entity for
// an area based on an incoming array of sensor entities

//node.warn("sensors: "+ msg.payload);

var entities = msg.payload;
var avgHum = 0;
var available_sensors = 0;
//
for (let i = 0; i < entities.length; i++) {
    var humidity = entities[i]['state'];
    // Ensure humidity is a number / available
    if (humidity != 'unavailable' && !isNaN(humidity)) {
        //node.warn("included: " + humidity);
        avgHum += parseFloat(humidity);
        available_sensors ++;
    }
}

avgHum = avgHum / available_sensors;
node.warn("avgHum: " + avgHum + " available_sensors: " + available_sensors);

msg.payload = avgHum;
// done in call service node
//newMsg = { global_id: 'average_' + area + '_humidity' };
node.warn(msg);
return msg;