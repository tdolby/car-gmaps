//
module.exports = GPSFix;

function GPSFix(lat, lon, time)
{
    if ( lat === undefined )
	this._lat  = 0;
    else
	this._lat  = lat;
	
    if ( lon === undefined )
	this._lon  = 0;
    else
	this._lon  = lon;
    if ( time === undefined )
	this._time = 0;
    else
    {
	// Handle 2016-01-02T15:53:34.926Z
	timeStr = new String(time);
	if ( timeStr.search(/-..-..T/) != -1 )
	{
	    date = new Date(timeStr);
	    this._time = date.getTime();
	    this._time = this._time / 1000;
	}
	else
	{
	    this._time = parseFloat(time);
	}
    }
};

GPSFix.prototype.lat       =  function() { return this._lat; };
GPSFix.prototype.lon       =  function() { return this._lon; };
GPSFix.prototype.epochTime =  function() { return this._time; };

