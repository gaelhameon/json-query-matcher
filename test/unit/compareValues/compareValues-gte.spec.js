const { expect } = require('chai');

const compareValues = require('../../../src/comparisonFunctions/compareValues');
const Logger = require('../../../src/logger/ConsoleLogger');
const logger = new Logger({level: 'off'});

describe('compareValues - $gte operator', () => {
  context(`with two values of the same type`, () => {
    context(`with strings`, () => {
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues("Allo", "Allo", "$gte", logger)).to.be.true;
        expect(compareValues("", "", "$gte", logger)).to.be.true;
        expect(compareValues(`allo`, "allo", "$gte", logger)).to.be.true;
        expect(compareValues(`${'al'}${'lo'}`, "allo", "$gte", logger)).to.be.true;
        expect(compareValues(`${'al'}${'lo'}`, "a" + "llo", "$gte", logger)).to.be.true;
        expect(compareValues(`$gte`, `$gte`, "$gte", logger)).to.be.true;
      });
      it(`compares the strings using the lexicographical order`, () => {
        expect(compareValues("Allo", "All", "$gte", logger)).to.be.true;
        expect(compareValues("Allo", "Alloah", "$gte", logger)).to.be.false;
        expect(compareValues("allo", "Allo", "$gte", logger)).to.be.true;
        expect(compareValues("Z", "A", "$gte", logger)).to.be.true;
        expect(compareValues("a", "Z", "$gte", logger)).to.be.true;
        expect(compareValues("2", "14", "$gte", logger)).to.be.true;
      });
    });
    context(`with numbers`, () => {
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues(0, 0, "$gte", logger)).to.be.true;
        expect(compareValues(0 + 2, 2, "$gte", logger)).to.be.true;
        expect(compareValues(2.5, 5 / 2, "$gte", logger)).to.be.true;
        expect(compareValues(2.500, 2.5, "$gte", logger)).to.be.true;
        expect(compareValues(2.000, 2, "$gte", logger)).to.be.true;
        expect(compareValues(Number.MAX_VALUE, Number.MAX_VALUE, "$gte", logger)).to.be.true;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, "$gte", logger)).to.be.true;
        expect(compareValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, "$gte", logger)).to.be.true;
      });
      it(`returns true if item value is greater than query value`, () => {
        expect(compareValues(1, 0, "$gte", logger)).to.be.true;
        expect(compareValues(0, -1, "$gte", logger)).to.be.true;
        expect(compareValues(1.1, 1, "$gte", logger)).to.be.true;
        expect(compareValues(0.1, 0, "$gte", logger)).to.be.true;
        expect(compareValues(1 / 1000000000000000, 1 / 1000000000000001, "$gte", logger)).to.be.true;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, "$gte", logger)).to.be.true;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.MAX_VALUE, "$gte", logger)).to.be.true;
      });
      it(`returns false otherwise`, () => {
        expect(compareValues(0, 1, "$gte", logger)).to.be.false;
        expect(compareValues(0.1, 1.0, "$gte", logger)).to.be.false;
        expect(compareValues(0, 0.000000000000000000000000001, "$gte", logger)).to.be.false;
        expect(compareValues(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, "$gte", logger)).to.be.false;
        expect(compareValues(Number.MAX_VALUE, Number.POSITIVE_INFINITY, "$gte", logger)).to.be.false;
      });
    });
    context(`with booleans`, () => {
      it(`returns true if itemValue is true and queryValue is false`, () => {
        expect(compareValues(true, false, "$gte", logger)).to.be.true;
      });
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues(true, true, "$gte", logger)).to.be.true;
        expect(compareValues(false, false, "$gte", logger)).to.be.true;
      });
      it(`returns false if itemValue is false and queryValue is true`, () => {
        expect(compareValues(false, true, "$gte", logger)).to.be.false;
      });
    });
    context(`with objects`, () => {
      it(`returns true if both are strictly the same instance`, () => {
        const a = { a: 1, b: 2 };
        const b = { a: a };
        expect(compareValues(a, a, "$gte", logger)).to.be.true;
        expect(compareValues(a, b.a, "$gte", logger)).to.be.true;
      });
      it(`returns true if both are different but don't have a specific "valueOf" method on their prototype`, () => {
        const a = { a: 1, b: 2 };
        const b = { a: a };
        expect(compareValues(a, b, "$gte", logger)).to.be.true;
      });
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

        expect(compareValues(a, a, "$gte", logger)).to.be.true;
        expect(compareValues(a, b.a, "$gte", logger)).to.be.true;
        expect(compareValues(a, c, "$gte", logger)).to.be.false;
        expect(compareValues(c, d, "$gte", logger)).to.be.true;
        expect(compareValues(e, d, "$gte", logger)).to.be.true;
        expect(compareValues(d, e, "$gte", logger)).to.be.false;
        expect(compareValues(e, 85, "$gte", logger)).to.be.false;
      });
    });
  });
  context(`with values of different types`, () => {
    it(`does what it wants ...`, () => {
      expect(compareValues("1", 1, "$gte", logger)).to.be.true;
      expect(compareValues(1, "1", "$gte", logger)).to.be.true;

      expect(compareValues("true", true, "$gte", logger)).to.be.false;
      expect(compareValues(true, "true", "$gte", logger)).to.be.false;

      expect(compareValues("", null, "$gte", logger)).to.be.true;
      expect(compareValues(null, "", "$gte", logger)).to.be.true;


      expect(compareValues("", undefined, "$gte", logger)).to.be.false;
      expect(compareValues(undefined, "", "$gte", logger)).to.be.false;

      expect(compareValues("", 0, "$gte", logger)).to.be.true;
      expect(compareValues(0, "", "$gte", logger)).to.be.true;

      expect(compareValues("", false, "$gte", logger)).to.be.true;
      expect(compareValues(false, "", "$gte", logger)).to.be.true;

      expect(compareValues(85, "75", "$gte", logger)).to.be.true;
      expect(compareValues(65, "75", "$gte", logger)).to.be.false;
    });
  });
});

