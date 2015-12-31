//   
//   
//
var GPSFix = require('./GPSFix.js');

module.exports = Zone;
function Zone()
{
    this.top    = 51.008452;
    this.bottom = 50.995122;
    this.left   = -1.358618;
    this.right  = -1.343020;
    this.topTriggerCallback =
	function(screenInformation)
        {
	    console.log("Entered zone");
	    screenInformation.setInfo(new GPSFix(50.956679, -1.380892, 0), 14);
	};
}
Zone.prototype.fixIsInZone = function(fix)
{
    if ( ( fix.lat() < this.top ) &&
	 ( fix.lat() > this.bottom ) &&
	 ( fix.lon() < this.right ) &&
	 ( fix.lon() > this.left ) )
	return true;
    else
	return false;
};
Zone.prototype.fixIsAboveZone = function(fix)
{
    if ( fix.lat() > this.top )
	return true;
    else
	return false;
};

Zone.prototype.callTopTrigger = function(screenInformation)
{
    this.topTriggerCallback(screenInformation);
};
Zone.prototype.setTopTrigger = function(newFunc)
{
    this.topTriggerCallback = newFunc;
};
