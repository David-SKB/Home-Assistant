// [WIP] Calculates the average light level to try and get an idea of
// when artifical light is in use and sunset/sunrise.
var sensorHistory = msg.payload;
var runningTotal = 0;
sensorHistory.forEach(function(element) {
    //node.warn(element);
    runningTotal += parseFloat(element.state);
});
node.warn(msg.entity_id);
node.warn("total: " + runningTotal);
var mean = runningTotal / sensorHistory.length;
node.warn("mean: " + mean);

// get the mean of all values below the mean, useful for detecting dimming
var subRunningTotal = 0;,
var subMean = 0;

var subCount = 0;
sensorHistory.forEach(function (element) {
    //node.warn(element);
    if (parseFloat(element.state) < mean) {
        subRunningTotal += parseFloat(element.state);
        subCount++;
    }
});
subMean = subRunningTotal / subCount;
node.warn("sub mean: " + subMean);
return msg;
