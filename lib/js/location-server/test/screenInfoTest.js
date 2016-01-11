var assert = require('assert');
var simple = require('/usr/local/lib/node_modules/simple-mock/index.js'); // This is ridiculous

var Zone = require('../Zone.js');
var GPSFix = require('../GPSFix.js');
var ScreenInformation = require('../ScreenInformation.js');
var ZoneManager = require('../ZoneManager.js');

describe('ScreenInformation', function() {

  describe('#updateFromData()', function () {
      var zoneManager = new ZoneManager('dummyZoneConf.yml');
      var zone;
      var initialFix = new GPSFix();
      var screenInformation;
      
      afterEach(function () {
	  simple.restore()
      })
      beforeEach(function() {
	  screenInformation = new ScreenInformation(initialFix, 13, zoneManager);
	  zone = zoneManager.getZoneByName('dummyZone');
      });
      
      it('should run top callback when zone entered from North', function()
      {
	  var previousFix = new GPSFix(1.01, 0, 1234567);
	  var currentFix  = new GPSFix(0.99, 0, 1234567);
	  simple.mock(zone, 'callTopTrigger');
	  
	  screenInformation.updateFromData(currentFix, previousFix);
	  assert(zone.callTopTrigger.called);
      });
      it('should run setinfo only once when zone entered from North', function()
      {
	  var previousFix = new GPSFix(1.01, 0, 1234567);
	  var currentFix  = new GPSFix(0.99, 0, 1234567);
	  simple.mock(screenInformation, 'setInfo');
	  
	  screenInformation.updateFromData(currentFix, previousFix);
	  assert.equal(screenInformation.setInfo.callCount, 1);
      });
      
      it('should not run top callback when zone entered from South', function()
      {
	  var previousFix = new GPSFix(0.99, 0, 1234567);
	  var currentFix  = new GPSFix(1.01, 0, 1234567);
	  simple.mock(zone, 'callTopTrigger');

	  screenInformation.updateFromData(currentFix, previousFix);
	  assert(!(zone.callTopTrigger.called));
      });
      it('should not run top callback when zone not entered', function()
      {
	  var previousFix = new GPSFix(13.01, -10.351, 1234567);
	  var currentFix  = new GPSFix(12.00, -10.352, 1234567);
	  simple.mock(zone, 'callTopTrigger');

	  screenInformation.updateFromData(currentFix, previousFix);
	  assert(!(zone.callTopTrigger.called));
      });
      
  });
});

