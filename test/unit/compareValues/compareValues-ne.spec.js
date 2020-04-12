const { expect } = require('chai');

const compareValues = require('../../../src/comparisonFunctions/compareValues');

describe('compareValues - $ne operator', () => {
  context(`with two values of the same type`, () => {
    context(`with strings`, () => {
      it(`returns false if both are strictly equal`, () => {
        expect(compareValues("Allo", "Allo", "$ne")).to.be.false;
        expect(compareValues("", "", "$ne")).to.be.false;
        expect(compareValues(`allo`, "allo", "$ne")).to.be.false;
        expect(compareValues(`${'al'}${'lo'}`, "allo", "$ne")).to.be.false;
        expect(compareValues(`${'al'}${'lo'}`, "a" + "llo", "$ne")).to.be.false;
        expect(compareValues(`$ne`, `$ne`, "$ne")).to.be.false;
      });
      it(`returns true otherwise`, () => {
        expect(compareValues("Allo", "allo", "$ne")).to.be.true;
        expect(compareValues("Allo", "Allo ", "$ne")).to.be.true;
        expect(compareValues(" ", "", "$ne")).to.be.true;
      });
    });
    context(`with numbers`, () => {
      it(`returns false if both are strictly equal`, () => {
        expect(compareValues(0, 0, "$ne")).to.be.false;
        expect(compareValues(0 + 2, 2, "$ne")).to.be.false;
        expect(compareValues(2.5, 5 / 2, "$ne")).to.be.false;
        expect(compareValues(2.500, 2.5, "$ne")).to.be.false;
        expect(compareValues(2.000, 2, "$ne")).to.be.false;
        expect(compareValues(Number.MAX_VALUE, Number.MAX_VALUE, "$ne")).to.be.false;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, "$ne")).to.be.false;
        expect(compareValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, "$ne")).to.be.false;
      });
      it(`returns true otherwise`, () => {
        expect(compareValues(0, 1, "$ne")).to.be.true;
        expect(compareValues(0.1, 1.0, "$ne")).to.be.true;
        expect(compareValues(0, 0.000000000000000000000000001, "$ne")).to.be.true;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, "$ne")).to.be.true;
        expect(compareValues(Number.MAX_VALUE, Number.POSITIVE_INFINITY, "$ne")).to.be.true;
      });
    });
    context(`with booleans`, () => {
      it(`returns false if both are strictly equal`, () => {
        expect(compareValues(true, true, "$ne")).to.be.false;
        expect(compareValues(false, false, "$ne")).to.be.false;
      });
      it(`returns true otherwise`, () => {
        expect(compareValues(true, false, "$ne")).to.be.true;
      });
    });
    context(`with objects`, () => {
      it(`returns false if both are strictly the same instance`, () => {
        const a = { a: 1, b: 2 };
        const b = { a: a };
        expect(compareValues(a, a, "$ne")).to.be.false;
        expect(compareValues(a, b.a, "$ne")).to.be.false;
      });
      it(`returns true otherwise`, () => {
        const a = { a: 1, b: 2 };
        const b = { a: 1, b: 2 };
        expect(compareValues(a, b, "$ne")).to.be.true;
        expect(compareValues(a, JSON.parse(JSON.stringify(a)), "$ne")).to.be.true;
      });
    });
  });
  context(`with values of different types`, () => {
    it(`returns true`, () => {
      expect(compareValues("1", 1, "$ne")).to.be.true;
      expect(compareValues("true", true, "$ne")).to.be.true;
      expect(compareValues("", null, "$ne")).to.be.true;
      expect(compareValues("", undefined, "$ne")).to.be.true;
      expect(compareValues("", 0, "$ne")).to.be.true;
      expect(compareValues("", false, "$ne")).to.be.true;
    });
  });
});

