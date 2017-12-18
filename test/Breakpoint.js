const { expect } = require('chai');
const assert = require('assert');
const Breakpoint = require('./../lib/breakpoint');

describe('Breakpoint', function () {
  describe('#constructor()', function () {
    it('should return an object with 4 properties', function () {
      let breakpoint = new Breakpoint();
      expect(breakpoint).to.have.property('lineNum');
      expect(breakpoint).to.have.property('srcRange');
      expect(breakpoint).to.have.property('instOffset');
      expect(breakpoint).to.have.property('map');
    });
  });
  describe('#constructor()', function () {
    it('should create an object with the correct 4 properties', function () {
      const breakpoint = new Breakpoint(
        7,
        { start: 3, end: 4 },
        30,
        { start: 182, length: 186, file: 1, jump: '-' }
      );
      expect(breakpoint.lineNum).to.equal(7);
      expect(breakpoint.srcRange).to.deep.equal({ start: 3, end: 4 });
      expect(breakpoint.instOffset).to.equal(30);
      expect(breakpoint.map).to.deep.equal(
        {
          start: 182,
          length: 186,
          file: 1,
          jump: '-',
        });
    });
  });
  describe('#get()', function () {
    it('should return an object with the given attributes', function () {
      const breakpoint = new Breakpoint(
        7,
        { start: 3, end: 4 },
        30,
        { start: 182, length: 186, file: 1 }
      );

      expect(breakpoint.lineNum).to.equal(breakpoint.getLineNum());
      expect(breakpoint.srcRange).to.deep.equal(breakpoint.getSrcRange());
      expect(breakpoint.instOffset).to.equal(breakpoint.getInstOffset());
      expect(breakpoint.map).to.deep.equal(breakpoint.getMap());

      assert.equal(breakpoint.lineNum, breakpoint.get().lineNum);
      assert.equal(breakpoint.srcRange, breakpoint.get().srcRange);
      assert.equal(breakpoint.instOffset, breakpoint.get().instOffset);
      assert.equal(breakpoint.map, breakpoint.get().map);
    });
  });
});
