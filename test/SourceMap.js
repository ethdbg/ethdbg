const { expect } = require('chai');
const SourceMap = require('./../lib/source_map');
const Contract = require('./../lib/contract');
const Logger = require('./../lib/logger');
const MockWeb3 = require('web3-fake-provider');

describe('SourceMap', function () {
  describe('#getInstOffset()', function () {
    it('should return the correct line number.', function () {
      this.timeout(3000);
      let logger = new Logger(4);
      const instResult = new SourceMap(logger, 'SimpleStorage',
        { path: './test/Simple.sol' })
        .getInstOffset(7);
      expect(instResult.startEnd.start.line).to.equal(7);
    });
    it('should return a range which includes the linenumber.', function () {
      let logger = new Logger(1);
      const instResult = new SourceMap(logger, 'SimpleStorage',
        { path: './test/Simple.sol' })
        .getInstOffset(4);
      expect(instResult.startEnd.start.line).below(4);
      expect(instResult.startEnd.end.line).above(4);
    });
  });
  describe('#getSourceLocationFromInsIndex', function () {
    it('should return the source location with a given index');
  });
  describe('#getSourceLocationFromPC', function () {
    it('should return the source location associated with the PC');
  });
  describe('#mapLineNums()', function () {
    let logger = new Logger(1);
    const srcMap = new SourceMap(logger, 'SimpleStorage', {
      path: './test/Simple.sol',
    });
    expect(srcMap.getSourceMap(7)).to.eql({
      startEnd: {
        start: { line: 7, column: 8 },
        end: { line: 7, column: 18 },
      },
      map: { start: 114, length: 10, file: 0, jump: '-' },
      offset: 8,
    });
  });
  describe('#getJSONMapArray()', function () {
    it('should return an object with the same key-vals as hashmap', function () {
      let logger = new Logger(1);
      const srcMap = new SourceMap(logger, 'SimpleStorage',
        { path: './test/Simple.sol' });
      const srcMapObj = srcMap.getJSONMapArray();
      expect(srcMapObj[7][1]).to.eql({
        startEnd: {
          start: { line: 7, column: 8 },
          end: { line: 7, column: 18 },
        },
        map: { start: 114, length: 10, file: 0, jump: '-' },
        offset: 8,
      });
    });
  });
});
