var assert = require('assert');
var simple = require('/usr/local/lib/node_modules/simple-mock/index.js'); // This is ridiculous

var Zone = require('../Zone.js');
var GPSFix = require('../GPSFix.js');
var ScreenInformation = require('../ScreenInformation.js');

describe('ScreenInformation', function() {

  describe('#updateFromData()', function () {
	
      var zone = new Zone('dummyZone', '', 1, -1, -1, 1, function(){console.log('blob');});
      var initialFix = new GPSFix();
      var screenInformation;
      
      afterEach(function () {
	  simple.restore()
      })
      beforeEach(function() {
	  screenInformation = new ScreenInformation(initialFix, 13);
	  zone = new Zone('dummyZone', '', 1, -1, -1, 1, function(){ console.log('blah');});
      });
      
      it('should run top callback when zone entered from North', function()
      {
	  var previousFix = new GPSFix(1.01, 0, 1234567);
	  var currentFix  = new GPSFix(0.99, 0, 1234567);
	  simple.mock(zone, 'callTopTrigger');
	  
	  screenInformation.updateFromData(zone, currentFix, previousFix);
	  assert(zone.callTopTrigger.called);
      });
      
      it('should not run top callback when zone entered from South', function()
      {
	  var previousFix = new GPSFix(0.99, 0, 1234567);
	  var currentFix  = new GPSFix(1.01, 0, 1234567);
	  simple.mock(zone, 'callTopTrigger');

	  screenInformation.updateFromData(zone, currentFix, previousFix);
	  assert(!(zone.callTopTrigger.called));
      });
      it('should not run top callback when zone not entered', function()
      {
	  var previousFix = new GPSFix(13.01, -10.351, 1234567);
	  var currentFix  = new GPSFix(12.00, -10.352, 1234567);
	  simple.mock(zone, 'callTopTrigger');

	  screenInformation.updateFromData(zone, currentFix, previousFix);
	  assert(!(zone.callTopTrigger.called));
      });
      
  });
});

