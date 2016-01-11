//
// This app does several things:
// - Gets location info sent from the PI in the car
// - 
// - 
//   
// - 
//   
//
var Zone = require('../lib/js/location-server/Zone.js');
var ZoneManager = require('../lib/js/location-server/ZoneManager.js');
var GPSFix = require('../lib/js/location-server/GPSFix.js');
var ScreenInformation = require('../lib/js/location-server/ScreenInformation.js');

var zoneManager = new ZoneManager('../../zoneConf.yml');
var screenInformation = new ScreenInformation(new GPSFix(), 13, zoneManager);
var previousFix = new GPSFix();
var currentFix = new GPSFix();
var scaleHack = 1;


var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.enable('trust proxy');
app.use(bodyParser.json()); // Car will send JSON

app.get('/car/display/location', function (req, res)
{
    var d = new Date();
    console.log(''+d.toString()+' Get request ('+req.ip+')');
    res.send(JSON.stringify(screenInformation));
});
app.post('/car/display/location', function (req, res)
{
    var d = new Date();
    console.log('Input ('+req.ip+'): '+req.body.lat+' '+req.body.lon+' '+req.body.time);
    //console.log(req.body);

    var fixReceived = new GPSFix(req.body.lat, req.body.lon, req.body.time);
    previousFix = currentFix;
    currentFix  = fixReceived;

    screenInformation.updateFromData(currentFix, previousFix);

    
    res.send(screenInformation.toJSON());
});
var server = app.listen(13000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
