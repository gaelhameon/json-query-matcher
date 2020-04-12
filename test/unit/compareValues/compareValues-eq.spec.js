const { expect } = require('chai');

const compareValues = require('../../../src/comparisonFunctions/compareValues');

describe('compareValues - $eq operator', () => {
  context(`with two values of the same type`, () => {
    context(`with strings`, () => {
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues("Allo", "Allo", "$eq")).to.be.true;
        expect(compareValues("", "", "$eq")).to.be.true;
        expect(compareValues(`allo`, "allo", "$eq")).to.be.true;
        expect(compareValues(`${'al'}${'lo'}`, "allo", "$eq")).to.be.true;
        expect(compareValues(`${'al'}${'lo'}`, "a" + "llo", "$eq")).to.be.true;
        expect(compareValues(`$eq`, `$eq`, "$eq")).to.be.true;
      });
      it(`returns false otherwise`, () => {
        expect(compareValues("Allo", "allo", "$eq")).to.be.false;
        expect(compareValues("Allo", "Allo ", "$eq")).to.be.false;
        expect(compareValues(" ", "", "$eq")).to.be.false;
      });
    });
    context(`with numbers`, () => {
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues(0, 0, "$eq")).to.be.true;
        expect(compareValues(0 + 2, 2, "$eq")).to.be.true;
        expect(compareValues(2.5, 5 / 2, "$eq")).to.be.true;
        expect(compareValues(2.500, 2.5, "$eq")).to.be.true;
        expect(compareValues(2.000, 2, "$eq")).to.be.true;
        expect(compareValues(Number.MAX_VALUE, Number.MAX_VALUE, "$eq")).to.be.true;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, "$eq")).to.be.true;
        expect(compareValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, "$eq")).to.be.true;
      });
      it(`returns false otherwise`, () => {
        expect(compareValues(0, 1, "$eq")).to.be.false;
        expect(compareValues(0.1, 1.0, "$eq")).to.be.false;
        expect(compareValues(0, 0.000000000000000000000000001, "$eq")).to.be.false;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, "$eq")).to.be.false;
        expect(compareValues(Number.MAX_VALUE, Number.POSITIVE_INFINITY, "$eq")).to.be.false;
      });
    });
    context(`with booleans`, () => {
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues(true, true, "$eq")).to.be.true;
        expect(compareValues(false, false, "$eq")).to.be.true;
      });
      it(`returns false otherwise`, () => {
        expect(compareValues(true, false, "$eq")).to.be.false;
      });
    });
    context(`with objects`, () => {
      it(`returns true if both are strictly the same instance`, () => {
        const a = { a: 1, b: 2 };
        const b = { a: a };
        expect(compareValues(a, a, "$eq")).to.be.true;
        expect(compareValues(a, b.a, "$eq")).to.be.true;
      });
      it(`returns false otherwise`, () => {
        const a = { a: 1, b: 2 };
        const b = { a: 1, b: 2 };
        expect(compareValues(a, b, "$eq")).to.be.false;
        expect(compareValues(a, JSON.parse(JSON.stringify(a)), "$eq")).to.be.false;
      });
    });
  });
  context(`with values of different types`, () => {
    it(`returns false`, () => {
      expect(compareValues("1", 1, "$eq")).to.be.false;
      expect(compareValues("true", true, "$eq")).to.be.false;
      expect(compareValues("", null, "$eq")).to.be.false;
      expect(compareValues("", undefined, "$eq")).to.be.false;
      expect(compareValues("", 0, "$eq")).to.be.false;
      expect(compareValues("", false, "$eq")).to.be.false;
    });
  });
});

