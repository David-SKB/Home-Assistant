// Format Start/End Date Window [v1.0]
// Gets the time window in ISO format based on msg.start_date and msg.end_date
// otherwise gets the past 24hrs
//
// [INPUT]:
// msg.start_date   : Start of the history period
// msg.end_date     : End of the history period
//
// [OUTPUT]:
// start_date   : msg.payload.start_date
// end_date     : msg.payload.end_date

// Hard-to-read one-line version, may struggle to check validity of date string or add more output formats in the future, 
// unless i try/catch the whole thing...
//msg.payload.start_date = ((msg.start_date != ("" || undefined)) ? new Date(msg.start_date) :  new Date(Date.now() - (86400 * 1000))).toISOString();
//msg.payload.end_date = ((msg.end_date != ("" || undefined)) ? new Date(msg.end_date) : new Date(Date.now())).toISOString();
//node.warn("[TEST] msg.payload.start_date: " + msg.payload.start_date);
//node.warn("[TEST] msg.payload.end_date: " + msg.payload.end_date);

var startDate;
var endDate;


if ( msg.start_date != ("" || undefined) ) {
    // Start date provided
    startDate = new Date(msg.start_date).toISOString();

    // Check if end date also provided
    if ( msg.end_date != ("" || undefined) ) {
        endDate = new Date(msg.end_date).toISOString();
    } else {
        endDate = new Date(Date.now()).toISOString();
    }

} else {

    // Otherwise default to past 24hrs if msg.days also not passed
    var days = (msg.days != ("" || undefined)) ? msg.days : 1;
    var fromDate   = Date.now() - ( (86400 * 1000) * days) ;

    startDate = new Date(fromDate).toISOString();
    endDate = new Date(Date.now()).toISOString();

}

//node.warn("[OUTPUT] start_date: " + start_date);
//node.warn("[OUTPUT] end_date: " + end_date);

// Return via msg.payload object
if (!(typeof msg.payload === 'object')) {
    msg.payload = {};
}
msg.payload.startdate  = startDate;
msg.payload.enddate    = endDate;
return msg;