const { expect } = require('chai');

const compareValues = require('../../../src/comparisonFunctions/compareValues');
const Logger = require('../../../src/logger/ConsoleLogger');
const logger = new Logger({level: 'off'});

describe('compareValues - $eq operator', () => {
  context(`with two values of the same type`, () => {
    context(`with strings`, () => {
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues("Allo", "Allo", "$eq", logger)).to.be.true;
        expect(compareValues("", "", "$eq", logger)).to.be.true;
        expect(compareValues(`allo`, "allo", "$eq", logger)).to.be.true;
        expect(compareValues(`${'al'}${'lo'}`, "allo", "$eq", logger)).to.be.true;
        expect(compareValues(`${'al'}${'lo'}`, "a" + "llo", "$eq", logger)).to.be.true;
        expect(compareValues(`$eq`, `$eq`, "$eq", logger)).to.be.true;
      });
      it(`returns false otherwise`, () => {
        expect(compareValues("Allo", "allo", "$eq", logger)).to.be.false;
        expect(compareValues("Allo", "Allo ", "$eq", logger)).to.be.false;
        expect(compareValues(" ", "", "$eq", logger)).to.be.false;
      });
    });
    context(`with numbers`, () => {
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues(0, 0, "$eq", logger)).to.be.true;
        expect(compareValues(0 + 2, 2, "$eq", logger)).to.be.true;
        expect(compareValues(2.5, 5 / 2, "$eq", logger)).to.be.true;
        expect(compareValues(2.500, 2.5, "$eq", logger)).to.be.true;
        expect(compareValues(2.000, 2, "$eq", logger)).to.be.true;
        expect(compareValues(Number.MAX_VALUE, Number.MAX_VALUE, "$eq", logger)).to.be.true;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, "$eq", logger)).to.be.true;
        expect(compareValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, "$eq", logger)).to.be.true;
      });
      it(`returns false otherwise`, () => {
        expect(compareValues(0, 1, "$eq", logger)).to.be.false;
        expect(compareValues(0.1, 1.0, "$eq", logger)).to.be.false;
        expect(compareValues(0, 0.000000000000000000000000001, "$eq", logger)).to.be.false;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, "$eq", logger)).to.be.false;
        expect(compareValues(Number.MAX_VALUE, Number.POSITIVE_INFINITY, "$eq", logger)).to.be.false;
      });
    });
    context(`with booleans`, () => {
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues(true, true, "$eq", logger)).to.be.true;
        expect(compareValues(false, false, "$eq", logger)).to.be.true;
      });
      it(`returns false otherwise`, () => {
        expect(compareValues(true, false, "$eq", logger)).to.be.false;
      });
    });
    context(`with objects`, () => {
      it(`returns true if both are strictly the same instance`, () => {
        const a = { a: 1, b: 2 };
        const b = { a: a };
        expect(compareValues(a, a, "$eq", logger)).to.be.true;
        expect(compareValues(a, b.a, "$eq", logger)).to.be.true;
      });
      it(`returns false otherwise`, () => {
        const a = { a: 1, b: 2 };
        const b = { a: 1, b: 2 };
        expect(compareValues(a, b, "$eq", logger)).to.be.false;
        expect(compareValues(a, JSON.parse(JSON.stringify(a)), "$eq", logger)).to.be.false;
      });
    });
  });
  context(`with values of different types`, () => {
    it(`returns false`, () => {
      expect(compareValues("1", 1, "$eq", logger)).to.be.false;
      expect(compareValues("true", true, "$eq", logger)).to.be.false;
      expect(compareValues("", null, "$eq", logger)).to.be.false;
      expect(compareValues("", undefined, "$eq", logger)).to.be.false;
      expect(compareValues("", 0, "$eq", logger)).to.be.false;
      expect(compareValues("", false, "$eq", logger)).to.be.false;
    });
  });
});

