//   
//   
//
var GPSFix = require('./GPSFix.js');

module.exports = Zone;
function Zone(name, description, top, bottom, left, right, topTriggerCallback)
{
    this._name   = name;
    this._description = description;
    this._top    = top;
    this._bottom = bottom;
    this._left   = left;
    this._right  = right;
    this._lastTimeInZone = 0;
    this._topTriggerCallback = topTriggerCallback;
}
Zone.prototype.fixIsInZone = function(fix)
{
    //console.log('fix '+JSON.stringify(fix)+' this '+JSON.stringify(this));
    if ( ( fix.lat() < this._top ) &&
	 ( fix.lat() > this._bottom ) &&
	 ( fix.lon() < this._right ) &&
	 ( fix.lon() > this._left ) )
    {
	var newDate = new Date();
	lastTimeInZone = newDate.getTime() / 1000;
	return true;
    }
    else
	return false;
};
Zone.prototype.fixIsAboveZone = function(fix)
{
    if ( fix.lat() > this._top )
	return true;
    else
	return false;
};

Zone.prototype.callTopTrigger = function(screenInformation, gpsFix, zoneManager)
{
    this._topTriggerCallback(screenInformation, gpsFix, zoneManager);
};
Zone.prototype.setTopTrigger = function(newFunc)
{
    this._topTriggerCallback = newFunc;
};

// newTime must be GMT epoch milliseconds
Zone.prototype.setLastTimeInZone = function(newTime)
{
    this._lastTimeInZone = newTime;
};

Zone.prototype.name   = function() { return this._name; };
Zone.prototype.description = function() { return this._description; };
Zone.prototype.top    = function() { return this._top; };
Zone.prototype.bottom = function() { return this._bottom; };
Zone.prototype.left   = function() { return this._left; };
Zone.prototype.right  = function() { return this._right; };
Zone.prototype.lastTimeInZone = function() { return this._lastTimeInZone; };
