// Function Template (v1)
// Just a function template..
// ******************************************************************
// -*- INPUTS -*-
// msg.payload              : current entity state value
// msg.global_id            : Global Context identifier / Entity ID
// msg.entities [OPTIONAL]  : Key/Value json mapping for input_select entities
//
// -*- OUTPUTS -*-
// msg.payload              : global variable value
// msg.global_id            : Actual Global Context identifier
// ******************************************************************

/*** START ***/
var utils = global.get("utils");

return msg;
/*** END ***/

/*** HELPER FUNCTIONS ***/
