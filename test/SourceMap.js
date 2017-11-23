const assert = require('assert');
const {expect} = require('chai');
const SourceMap = require('./../lib/source_map');
const Contract = require('./../lib/contract');
const Logger = require('./../lib/logger');

describe('SourceMap', function() {
  describe('#getInstOffset()', function() {
    it('should return the correct line number.', function() {
      this.timeout(3000);
      let logger = new Logger(1);
      let contract = new Contract(null, './test/Simple.sol',
                                  'SimpleStorage', {});
      assert.equal(7,
      new SourceMap(contract, logger)
        .getInstOffset(7).startEnd.end.line);
    });
    it('should return a range which includes the linenumber.', function() {
      this.timeout(3000);
      let logger = new Logger(1);
      let contract = new Contract(null, './test/Simple.sol',
        'SimpleStorage', {});
      const instResult = new SourceMap(contract, logger).getInstOffset(4);
      expect(instResult.startEnd.start.line).below(4);
      expect(instResult.startEnd.end.line).above(4);
    });
  });
});
