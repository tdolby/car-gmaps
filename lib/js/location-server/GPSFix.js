//
module.exports = GPSFix;

function GPSFix()
{
    this._lat  =  50.939390;
    this._lon  =
    this._time = 0;
};

function GPSFix(lat, lon, time)
{
    if ( lat === undefined )
	this._lat  = 50.939390;
    else
	this._lat  = lat;
	
    if ( lon === undefined )
	this._lon  =  -1.38416;
    else
	this._lon  = lon;
    if ( time === undefined )
	this._time = 0;
    else
	this._time = time;
};

GPSFix.prototype.lat       =  function() { return this._lat; };
GPSFix.prototype.lon       =  function() { return this._lon; };
GPSFix.prototype.epochTime =  function() { return this._time; };

