let assert = require('assert');
let SourceMap = require('../lib/source_map.js');
let Contract = require('../lib/contract.js');
let Logger = require('../lib/logger.js');

describe('SourceMap', () => {
  describe('#getInstOffset()', () => {
    it('should return a correct thingy', () => {
      let logger = new Logger(5);
      let contract = new Contract(null, './test/Simple.sol',
                                  'SimpleStorage', {});
      assert.equal(4,
      new SourceMap(contract, logger)
                   .getInstOffset(4).startEnd.end);
    });
  });
});
