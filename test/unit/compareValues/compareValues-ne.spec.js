const { expect } = require('chai');

const compareValues = require('../../../src/comparisonFunctions/compareValues');
const Logger = require('../../../src/logger/ConsoleLogger');
const logger = new Logger({level: 'off'});

describe('compareValues - $ne operator', () => {
  context(`with two values of the same type`, () => {
    context(`with strings`, () => {
      it(`returns false if both are strictly equal`, () => {
        expect(compareValues("Allo", "Allo", "$ne", logger)).to.be.false;
        expect(compareValues("", "", "$ne", logger)).to.be.false;
        expect(compareValues(`allo`, "allo", "$ne", logger)).to.be.false;
        expect(compareValues(`${'al'}${'lo'}`, "allo", "$ne", logger)).to.be.false;
        expect(compareValues(`${'al'}${'lo'}`, "a" + "llo", "$ne", logger)).to.be.false;
        expect(compareValues(`$ne`, `$ne`, "$ne", logger)).to.be.false;
      });
      it(`returns true otherwise`, () => {
        expect(compareValues("Allo", "allo", "$ne", logger)).to.be.true;
        expect(compareValues("Allo", "Allo ", "$ne", logger)).to.be.true;
        expect(compareValues(" ", "", "$ne", logger)).to.be.true;
      });
    });
    context(`with numbers`, () => {
      it(`returns false if both are strictly equal`, () => {
        expect(compareValues(0, 0, "$ne", logger)).to.be.false;
        expect(compareValues(0 + 2, 2, "$ne", logger)).to.be.false;
        expect(compareValues(2.5, 5 / 2, "$ne", logger)).to.be.false;
        expect(compareValues(2.500, 2.5, "$ne", logger)).to.be.false;
        expect(compareValues(2.000, 2, "$ne", logger)).to.be.false;
        expect(compareValues(Number.MAX_VALUE, Number.MAX_VALUE, "$ne", logger)).to.be.false;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, "$ne", logger)).to.be.false;
        expect(compareValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, "$ne", logger)).to.be.false;
      });
      it(`returns true otherwise`, () => {
        expect(compareValues(0, 1, "$ne", logger)).to.be.true;
        expect(compareValues(0.1, 1.0, "$ne", logger)).to.be.true;
        expect(compareValues(0, 0.000000000000000000000000001, "$ne", logger)).to.be.true;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, "$ne", logger)).to.be.true;
        expect(compareValues(Number.MAX_VALUE, Number.POSITIVE_INFINITY, "$ne", logger)).to.be.true;
      });
    });
    context(`with booleans`, () => {
      it(`returns false if both are strictly equal`, () => {
        expect(compareValues(true, true, "$ne", logger)).to.be.false;
        expect(compareValues(false, false, "$ne", logger)).to.be.false;
      });
      it(`returns true otherwise`, () => {
        expect(compareValues(true, false, "$ne", logger)).to.be.true;
      });
    });
    context(`with objects`, () => {
      it(`returns false if both are strictly the same instance`, () => {
        const a = { a: 1, b: 2 };
        const b = { a: a };
        expect(compareValues(a, a, "$ne", logger)).to.be.false;
        expect(compareValues(a, b.a, "$ne", logger)).to.be.false;
      });
      it(`returns true otherwise`, () => {
        const a = { a: 1, b: 2 };
        const b = { a: 1, b: 2 };
        expect(compareValues(a, b, "$ne", logger)).to.be.true;
        expect(compareValues(a, JSON.parse(JSON.stringify(a)), "$ne", logger)).to.be.true;
      });
    });
  });
  context(`with values of different types`, () => {
    it(`returns true`, () => {
      expect(compareValues("1", 1, "$ne", logger)).to.be.true;
      expect(compareValues("true", true, "$ne", logger)).to.be.true;
      expect(compareValues("", null, "$ne", logger)).to.be.true;
      expect(compareValues("", undefined, "$ne", logger)).to.be.true;
      expect(compareValues("", 0, "$ne", logger)).to.be.true;
      expect(compareValues("", false, "$ne", logger)).to.be.true;
    });
  });
});

