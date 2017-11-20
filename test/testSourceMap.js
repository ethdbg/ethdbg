let assert = require('assert');
let SourceMap = require('../lib/source_map.js');
let Contract = require('../lib/contract.js');
let Logger = require('../lib/logger.js');

<<<<<<< HEAD
// TODO: Figure out why mocha times out
describe('SourceMap', () => {
  describe('#getInstOffset()', () => {
    it('should return a correct thingy', (done) => {
      let logger = new Logger(1);
=======
describe('SourceMap', function() {
  describe('#getInstOffset()', function() {
    it('should return the correct line number', function() {
      this.timeout(3000);
      let logger = new Logger(5);
>>>>>>> de8d1a995dd5c56d535b707dfa6f5b29285379a1
      let contract = new Contract(null, './test/Simple.sol',
                                  'SimpleStorage', {});
      assert.equal(7,
      new SourceMap(contract, logger)
        .getInstOffset(7).startEnd.end.line);
    });
  });
});
