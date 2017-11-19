let assert = require('assert');
let SourceMap = require('../lib/source_map.js');
let Contract = require('../lib/contract.js');
let Logger = require('../lib/logger.js');

// TODO: Figure out why mocha times out
describe('SourceMap', () => {
  describe('#getInstOffset()', () => {
    it('should return a correct thingy', (done) => {
      let logger = new Logger(5);
      let contract = new Contract(null, './test/Simple.sol',
                                  'SimpleStorage', {});
      assert.equal(7,
      new SourceMap(contract, logger)
        .getInstOffset(7).startEnd.end.line);
      done();
    });
  });
});
