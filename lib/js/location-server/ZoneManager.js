//   
//   
//
yaml = require('/usr/local/lib/node_modules/js-yaml/index.js'); // insane
fs   = require('fs');
var GPSFix = require('./GPSFix.js');
var Zone = require('./Zone.js');

module.exports = ZoneManager;
function ZoneManager(yamlZoneFile)
{
    this.zoneMap = {};
    try
    {
	var zoneDoc = yaml.load(fs.readFileSync(yamlZoneFile, 'utf8'));
	for (zone in zoneDoc.zones)
	{
	    //console.log("Looking at zone "+zone);
	    var z = zoneDoc.zones[zone];
	    var newZone = new Zone(''+zone, z.description, z.top, z.bottom, z.left, z.right, z.topTriggerCallback);
	    //console.log("z "+z.topTriggerCallback);
	    this.zoneMap[zone] =  newZone;
	}
	//console.log(zoneDoc);
    }
    catch (e)
    {
	console.log(e);
    }
}
ZoneManager.prototype.getZoneByName = function(name)
{
    return this.zoneMap[name];
};
ZoneManager.prototype.getZoneList = function()
{
    var newObj = {};
    for (var key in this.zoneMap) {
        newObj[key] = this.zoneMap[key];
    }
    return newObj;
};
