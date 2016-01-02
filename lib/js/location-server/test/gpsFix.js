var assert = require('assert');
var simple = require('/usr/local/lib/node_modules/simple-mock/index.js'); // This is ridiculous

var GPSFix = require('../GPSFix.js');

describe('GPSFix', function() {

  describe('#constructor()', function () {
	
      afterEach(function () {
	  simple.restore()
      })
      beforeEach(function() {

      });
      
      it('should return epoch time when passed epoch time', function()
      {
	  var testFix = new GPSFix(11.01, -1, 1234567.123);
	  assert.equal(testFix.epochTime(), 1234567.123);
      });
      it('should return epoch time when passed epoch time as string', function()
      {
	  var testFix = new GPSFix(11.01, -1, "1234567.123");
	  assert.equal(testFix.epochTime(), 1234567.123);
      });
      it('should return epoch time when passed ISO 8601', function()
      {
	  var testFix = new GPSFix(11.01, -1, "2016-01-02T15:53:16.926Z");
	  assert.equal(testFix.epochTime(), 1451749996.926);
      });
  });
});

