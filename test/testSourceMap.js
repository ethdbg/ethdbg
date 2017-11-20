let assert = require('assert');
let SourceMap = require('../lib/source_map.js');
let Contract = require('../lib/contract.js');
let Logger = require('../lib/logger.js');

describe('SourceMap', function() {
  this.slow(2);
  describe('#getInstOffset()', function() {
    it('should return the correct line number', function() {
      this.timeout(3000);
      let logger = new Logger(5);
      let contract = new Contract(null, './test/Simple.sol',
                                  'SimpleStorage', {});
      assert.equal(7,
      new SourceMap(contract, logger)
        .getInstOffset(7).startEnd.end.line);
    });
  });
});
