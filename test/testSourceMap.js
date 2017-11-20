const assert = require('assert');
const SourceMap = require('./../lib/source_map');
const Contract = require('./../lib/contract');
const Logger = require('./../lib/logger');
const Breakpoint = require('./../lib/breakpointManager');

describe('SourceMap', function() {
  describe('#getInstOffset()', function() {
    it('should return the correct line number.', function() {
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

describe('Breakpoint', function() {
  describe('#get()', function() {
    it('should return an object with the given attributes.', function() {
      let breakpoint = new Breakpoint(3, 5, 8);
      let obj = {};
      obj.lineNum = 3;
      obj.byteRange = 5;
      obj.insNum = 8;
      assert.equal(obj.lineNum, breakpoint.get().lineNum);
      assert.equal(obj.byteRange, breakpoint.get().byteRange);
      assert.equal(obj.insNum, breakpoint.get().insNum);
    });
  });
});
