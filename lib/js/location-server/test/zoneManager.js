var assert = require('assert');
var simple = require('/usr/local/lib/node_modules/simple-mock/index.js'); // This is ridiculous
var expect = require('/usr/local/lib/node_modules/expect.js/index.js');

var ZoneManager = require('../ZoneManager.js');

describe('ZoneManager', function() {

  describe('#constructor()', function () {
	
      afterEach(function () {
	  simple.restore()
      })
      beforeEach(function() {

      });
      
      it('should load zones from file', function()
      {
	  var zm = new ZoneManager("zoneConf.yml");
	  var testZoneFromFile = zm.getZoneByName('GulfOfGuinea');
	  assert.equal(0.1, testZoneFromFile.top());
      });
      it('should load JS functions from file', function()
      {
	  var zm = new ZoneManager("zoneConf.yml");
	  var testZoneFromFile = zm.getZoneByName('GulfOfGuinea');
	  // Simply handing in the function causes it to be called
	  // without a "this" pointer, so we wrap it first.
	  expect(function() { testZoneFromFile.callTopTrigger(); }).to.throwException(/expected exception/);
      });
      it('should allows JS functions to see other zones', function()
      {
	  var zm = new ZoneManager("zoneConf.yml");
	  var gogZone = zm.getZoneByName('GulfOfGuinea');
	  var greenwichZone = zm.getZoneByName('Greenwich');
	  // Simply handing in the function causes it to be called
	  // without a "this" pointer, so we wrap it first.
	  expect(function() { greenwichZone.callTopTrigger(null, null, zm); }).to.throwException(/no lastTimeInZone for GulfOfGuinea/);
	  var testDate = new Date();
	  testDate.setHours(9);
	  //console.log("testDate "+testDate);
	  gogZone.setLastTimeInZone(testDate.getTime() / 1000);
	  expect(function() { greenwichZone.callTopTrigger(null, null, zm); }).to.not.throwException();
	  
      });
  });
});

