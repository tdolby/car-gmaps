//
var GPSFix = require('./GPSFix.js');

module.exports = ScreenInformation;

function ScreenInformation(fix, scale, zoneManager)
{
    this._fix  = new GPSFix(fix.lat(), fix.lon(), fix.epochTime());
    this._scale = scale;
    this._zoneManager = zoneManager;
    //console.log("Constructor: "+fix.lat()+" "+fix.lon());
    //console.log("Constructor: "+this._fix.lat()+" "+this._fix.lon());
};

ScreenInformation.prototype.setInfo = function (fix, scale)
{
    this._fix  = new GPSFix(fix.lat(), fix.lon(), fix.epochTime());
    this._scale = scale;
    //console.log("Setting info: "+this._fix.lat()+" "+this._fix.lon());
};

ScreenInformation.prototype.toJSON    =  function()
{
    //console.log("toJSON(): this._scale "+this._scale);
    var jsonStruct = { location: { lat: this._fix.lat(), lon: this._fix.lon() }, scale: this._scale };
    return JSON.stringify(jsonStruct);
};
ScreenInformation.prototype.scale     =  function() { return this._scale; };
ScreenInformation.prototype.fix       =  function() { return this._fix; };


ScreenInformation.prototype.updateFromData = function(currentFix, previousFix)
{
    var inAnyZone = false;

    var zoneList = this._zoneManager.getZoneList();
    for (var key in zoneList) 
    {
	var zone = zoneList[key];
	if ( zone.fixIsInZone(currentFix) )
	{
	    inAnyZone = true;
	    // We're in the zone; did we just enter?
	    if ( zone.fixIsAboveZone(previousFix) )
	    {
		// Yes
		zone.callTopTrigger(this, GPSFix, this._zoneManager);
	    }
	}
    }
    if ( !inAnyZone )
    {
	this.setInfo(currentFix, 13);
    }
}
