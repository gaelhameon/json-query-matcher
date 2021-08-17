const { expect } = require('chai');

const compareValues = require('../../../src/comparisonFunctions/compareValues');
const Logger = require('../../../src/logger/ConsoleLogger');
const logger = new Logger({level: 'off'});

describe('compareValues - $gt operator', () => {
  context(`with two values of the same type`, () => {
    context(`with strings`, () => {
      it(`returns false if both are strictly equal`, () => {
        expect(compareValues("Allo", "Allo", "$gt", logger)).to.be.false;
        expect(compareValues("", "", "$gt", logger)).to.be.false;
        expect(compareValues(`allo`, "allo", "$gt", logger)).to.be.false;
        expect(compareValues(`${'al'}${'lo'}`, "allo", "$gt", logger)).to.be.false;
        expect(compareValues(`${'al'}${'lo'}`, "a" + "llo", "$gt", logger)).to.be.false;
        expect(compareValues(`$gt`, `$gt`, "$gt", logger)).to.be.false;
      });
      it(`compares the strings using the lexicographical order`, () => {
        expect(compareValues("Allo", "All", "$gt", logger)).to.be.true;
        expect(compareValues("Allo", "Alloah", "$gt", logger)).to.be.false;
        expect(compareValues("allo", "Allo", "$gt", logger)).to.be.true;
        expect(compareValues("Z", "A", "$gt", logger)).to.be.true;
        expect(compareValues("a", "Z", "$gt", logger)).to.be.true;
        expect(compareValues("2", "14", "$gt", logger)).to.be.true;
      });
    });
    context(`with numbers`, () => {
      it(`returns false if both are equal`, () => {
        expect(compareValues(0, 0, "$gt", logger)).to.be.false;
        expect(compareValues(0 + 2, 2, "$gt", logger)).to.be.false;
        expect(compareValues(2.5, 5 / 2, "$gt", logger)).to.be.false;
        expect(compareValues(2.500, 2.5, "$gt", logger)).to.be.false;
        expect(compareValues(2.000, 2, "$gt", logger)).to.be.false;
        expect(compareValues(Number.MAX_VALUE, Number.MAX_VALUE, "$gt", logger)).to.be.false;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, "$gt", logger)).to.be.false;
        expect(compareValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, "$gt", logger)).to.be.false;
      });
      it(`returns true if item value is strictly greater than query value`, () => {
        expect(compareValues(1, 0, "$gt", logger)).to.be.true;
        expect(compareValues(0, -1, "$gt", logger)).to.be.true;
        expect(compareValues(1.1, 1, "$gt", logger)).to.be.true;
        expect(compareValues(0.1, 0, "$gt", logger)).to.be.true;
        expect(compareValues(1 / 1000000000000000, 1 / 1000000000000001, "$gt", logger)).to.be.true;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, "$gt", logger)).to.be.true;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.MAX_VALUE, "$gt", logger)).to.be.true;
      });
      it(`returns false otherwise`, () => {
        expect(compareValues(0, 1, "$gt", logger)).to.be.false;
        expect(compareValues(0.1, 1.0, "$gt", logger)).to.be.false;
        expect(compareValues(0, 0.000000000000000000000000001, "$gt", logger)).to.be.false;
        expect(compareValues(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, "$gt", logger)).to.be.false;
        expect(compareValues(Number.MAX_VALUE, Number.POSITIVE_INFINITY, "$gt", logger)).to.be.false;
      });
    });
    context(`with booleans`, () => {
      it(`returns true if itemValue is true and queryValue is false`, () => {
        expect(compareValues(true, false, "$gt", logger)).to.be.true;
      });
      it(`returns false otherwise`, () => {
        expect(compareValues(false, true, "$gt", logger)).to.be.false;
        expect(compareValues(true, true, "$gt", logger)).to.be.false;
        expect(compareValues(false, false, "$gt", logger)).to.be.false;
      });
    });
    context(`with objects`, () => {
      it(`compares the result of "valueOf" of the prototype`, () => {
        const a = { a: 1, b: 2 };
        const b = { a: a };
        class MyObj {
          constructor(height) {
            this.height = height;
          }
          valueOf() {
            return this.height;
          }
        }
        const c = new MyObj(65);
        const d = new MyObj(65);
        const e = new MyObj(75);

        expect(compareValues(a, a, "$gt", logger)).to.be.false;
        expect(compareValues(a, b.a, "$gt", logger)).to.be.false;
        expect(compareValues(a, b, "$gt", logger)).to.be.false;
        expect(compareValues(a, c, "$gt", logger)).to.be.false;
        expect(compareValues(c, d, "$gt", logger)).to.be.false;
        expect(compareValues(e, d, "$gt", logger)).to.be.true;
        expect(compareValues(d, e, "$gt", logger)).to.be.false;
        expect(compareValues(e, 85, "$gt", logger)).to.be.false;
      });
    });
  });
  context(`with values of different types`, () => {
    it(`does what it wants ...`, () => {
      expect(compareValues("1", 1, "$gt", logger)).to.be.false;
      expect(compareValues(1, "1", "$gt", logger)).to.be.false;

      expect(compareValues("true", true, "$gt", logger)).to.be.false;
      expect(compareValues(true, "true", "$gt", logger)).to.be.false;

      expect(compareValues("", null, "$gt", logger)).to.be.false;
      expect(compareValues(null, "", "$gt", logger)).to.be.false;


      expect(compareValues("", undefined, "$gt", logger)).to.be.false;
      expect(compareValues(undefined, "", "$gt", logger)).to.be.false;

      expect(compareValues("", 0, "$gt", logger)).to.be.false;
      expect(compareValues(0, "", "$gt", logger)).to.be.false;

      expect(compareValues("", false, "$gt", logger)).to.be.false;
      expect(compareValues(false, "", "$gt", logger)).to.be.false;

      expect(compareValues(85, "75", "$gt", logger)).to.be.true;
      expect(compareValues(65, "75", "$gt", logger)).to.be.false;
    });
  });
});

