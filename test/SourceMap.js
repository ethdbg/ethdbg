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
      const instResult = new SourceMap(logger, contract).getInstOffset(7);
      expect(instResult.startEnd.start.line).to.equal(7);
    });
    it('should return a range which includes the linenumber.', function() {
      let logger = new Logger(1);
      let contract = new Contract(null, './test/Simple.sol',
        'SimpleStorage', {});
      const instResult = new SourceMap(logger, contract).getInstOffset(4);
      expect(instResult.startEnd.start.line).below(4);
      expect(instResult.startEnd.end.line).above(4);
    });
  });
  describe('#mapLineNums()', function() {
    let logger = new Logger(5);
    let contract = new Contract(null, './test/Simple.sol',
      'SimpleStorage', {});
    const srcMap = new SourceMap(logger, contract);
    expect(srcMap.get(7)).to.deep.equal({
      startEnd: { 
        start: { line: 7, column: 8 }, 
        end: {line: 7, column: 18 },
      },
      map: { start: 107, length: 10, file: 0, jump: '-' },
      offset: 8
    });
  });
  describe('#getJSONMapArray()', function() {
    it('should return an object with the same key-vals as hashmap', function() {
      let logger = new Logger(5);
      let contract = new Contract(null, './test/Simple.sol',
        'SimpleStorage', {});
      const srcMap = new SourceMap(logger, contract);
      const srcMapObj = srcMap.getJSONMapArray();
      expect(srcMapObj[7][1]).to.deep.equal({
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
