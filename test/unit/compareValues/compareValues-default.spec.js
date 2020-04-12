const { expect } = require('chai');

const compareValues = require('../../../src/compareValues');

describe('compareValues - default (no operator)', () => {
  context(`with two values of the same type`, () => {
    context(`with strings`, () => {
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues("Allo", "Allo")).to.be.true;
        expect(compareValues("", "")).to.be.true;
        expect(compareValues(`allo`, "allo")).to.be.true;
        expect(compareValues(`${'al'}${'lo'}`, "allo")).to.be.true;
        expect(compareValues(`${'al'}${'lo'}`, "a" + "llo")).to.be.true;
        expect(compareValues(`$eq`, `$eq`)).to.be.true;
      });
      it(`returns false otherwise`, () => {
        expect(compareValues("Allo", "allo")).to.be.false;
        expect(compareValues("Allo", "Allo ")).to.be.false;
        expect(compareValues(" ", "")).to.be.false;
      });
    });
    context(`with numbers`, () => {
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues(0, 0)).to.be.true;
        expect(compareValues(0 + 2, 2)).to.be.true;
        expect(compareValues(2.5, 5 / 2)).to.be.true;
        expect(compareValues(2.500, 2.5)).to.be.true;
        expect(compareValues(2.000, 2)).to.be.true;
        expect(compareValues(Number.MAX_VALUE, Number.MAX_VALUE)).to.be.true;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).to.be.true;
        expect(compareValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)).to.be.true;
      });
      it(`returns false otherwise`, () => {
        expect(compareValues(0, 1)).to.be.false;
        expect(compareValues(0.1, 1.0)).to.be.false;
        expect(compareValues(0, 0.000000000000000000000000001)).to.be.false;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY)).to.be.false;
        expect(compareValues(Number.MAX_VALUE, Number.POSITIVE_INFINITY)).to.be.false;
      });
    });
    context(`with booleans`, () => {
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues(true, true)).to.be.true;
        expect(compareValues(false, false)).to.be.true;
      });
      it(`returns false otherwise`, () => {
        expect(compareValues(true, false)).to.be.false;
      });
    });
    context(`with objects`, () => {
      it(`returns true if both are strictly the same instance`, () => {
        const a = { a: 1, b: 2 };
        const b = { a: a };
        expect(compareValues(a, a)).to.be.true;
        expect(compareValues(a, b.a)).to.be.true;
      });
      it(`returns false otherwise`, () => {
        const a = { a: 1, b: 2 };
        const b = { a: 1, b: 2 };
        expect(compareValues(a, b)).to.be.false;
        expect(compareValues(a, JSON.parse(JSON.stringify(a)))).to.be.false;
      });
    });
  });
  context(`with values of different types`, () => {
    it(`returns false`, () => {
      expect(compareValues("1", 1)).to.be.false;
      expect(compareValues("true", true)).to.be.false;
      expect(compareValues("", null)).to.be.false;
      expect(compareValues("", undefined)).to.be.false;
      expect(compareValues("", 0)).to.be.false;
      expect(compareValues("", false)).to.be.false;
    });
  });
});

