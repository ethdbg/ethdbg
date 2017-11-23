const {expect} = require('chai');
const SourceMap = require('./../lib/source_map');
const Contract = require('./../lib/contract');
const Logger = require('./../lib/logger');

describe('SourceMap', function() {
  describe('#getInstOffset()', function() {
    it('should return the correct line number.', function() {
      this.timeout(3000);
      let logger = new Logger(4);
      let contract = new Contract(null, './test/Simple.sol',
        'SimpleStorage', {});
      const instResult = new SourceMap(contract, logger).getInstOffset(7);
      expect(instResult.startEnd.start.line).to.equal(7);
    });
    it('should return a range which includes the linenumber.', function() {
      this.timeout(3000);
      let logger = new Logger(5);
      let contract = new Contract(null, './test/Simple.sol',
        'SimpleStorage', {});
      const instResult = new SourceMap(contract, logger).getInstOffset(4);
      expect(instResult.startEnd.start.line).below(4);
      expect(instResult.startEnd.end.line).above(4);
    });
  });
  describe('#mapLineNums()', function() {
    it('should return a hashmap with key (num) value(obj) pairs', function() {
      this.timeout(4000);
      let logger = new Logger(4);
      let contract = new Contract(null, './test/Simple.sol',
        'SimpleStorage', {});
      const srcMap = new SourceMap(contract, logger);
      srcMap.mapLineNums();
      expect(srcMap.get(7)).to.deep.equal({
        startEnd: { 
          start: { line: 7, column: 8 }, 
          end: {line: 7, column: 18 },
        },
        map: { start: 107, length: 10, file: 0, jump: '-' },
        offset: 8
      });
    });
  });
});


