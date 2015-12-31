var assert = require('assert');
var simple = require('/usr/local/lib/node_modules/simple-mock/index.js'); // This is ridiculous

var Zone = require('../Zone.js');
var GPSFix = require('../GPSFix.js');
var ScreenInformation = require('../ScreenInformation.js');

describe('ScreenInformation', function() {

  describe('#updateFromData()', function () {
	
      var zone = new Zone();
      var initialFix = new GPSFix();
      var screenInformation;
      
      afterEach(function () {
	  simple.restore()
      })
      beforeEach(function() {
	  screenInformation = new ScreenInformation(initialFix, 13);
	  zone = new Zone();
      });
      
      it('should run top callback when zone entered from North', function()
      {
	  var previousFix = new GPSFix(51.01, -1.351, 1234567);
	  var currentFix  = new GPSFix(51.00, -1.352, 1234567);
	  simple.mock(zone, 'callTopTrigger');
	  
	  screenInformation.updateFromData(zone, currentFix, previousFix);
	  assert(zone.callTopTrigger.called);
      });
      
      it('should not run top callback when zone entered from South', function()
      {
	  var previousFix = new GPSFix(50.98, -1.351, 1234567);
	  var currentFix  = new GPSFix(51.00, -1.352, 1234567);
	  simple.mock(zone, 'callTopTrigger');

	  screenInformation.updateFromData(zone, currentFix, previousFix);
	  assert(!(zone.callTopTrigger.called));
      });
      it('should not run top callback when zone not entered', function()
      {
	  var previousFix = new GPSFix(53.01, -1.351, 1234567);
	  var currentFix  = new GPSFix(52.00, -1.352, 1234567);
	  simple.mock(zone, 'callTopTrigger');

	  screenInformation.updateFromData(zone, currentFix, previousFix);
	  assert(!(zone.callTopTrigger.called));
      });
      
  });
});

