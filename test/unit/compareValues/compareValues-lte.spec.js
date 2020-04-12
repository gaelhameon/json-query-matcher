const { expect } = require('chai');

const compareValues = require('../../../src/comparisonFunctions/compareValues');

describe('compareValues - $lte operator', () => {
  context(`with two values of the same type`, () => {
    context(`with strings`, () => {
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues("Allo", "Allo", "$lte")).to.be.true;
        expect(compareValues("", "", "$lte")).to.be.true;
        expect(compareValues(`allo`, "allo", "$lte")).to.be.true;
        expect(compareValues(`${'al'}${'lo'}`, "allo", "$lte")).to.be.true;
        expect(compareValues(`${'al'}${'lo'}`, "a" + "llo", "$lte")).to.be.true;
        expect(compareValues(`$lte`, `$lte`, "$lte")).to.be.true;
      });
      it(`compares the strings using the lexicographical order`, () => {
        expect(compareValues("Allo", "All", "$lte")).to.be.false;
        expect(compareValues("Allo", "Alloah", "$lte")).to.be.true;
        expect(compareValues("allo", "Allo", "$lte")).to.be.false;
        expect(compareValues("Z", "A", "$lte")).to.be.false;
        expect(compareValues("a", "Z", "$lte")).to.be.false;
        expect(compareValues("2", "14", "$lte")).to.be.false;
      });
    });
    context(`with numbers`, () => {
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues(0, 0, "$lte")).to.be.true;
        expect(compareValues(0 + 2, 2, "$lte")).to.be.true;
        expect(compareValues(2.5, 5 / 2, "$lte")).to.be.true;
        expect(compareValues(2.500, 2.5, "$lte")).to.be.true;
        expect(compareValues(2.000, 2, "$lte")).to.be.true;
        expect(compareValues(Number.MAX_VALUE, Number.MAX_VALUE, "$lte")).to.be.true;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, "$lte")).to.be.true;
        expect(compareValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, "$lte")).to.be.true;
      });
      it(`returns false if item value is greater than query value`, () => {
        expect(compareValues(1, 0, "$lte")).to.be.false;
        expect(compareValues(0, -1, "$lte")).to.be.false;
        expect(compareValues(1.1, 1, "$lte")).to.be.false;
        expect(compareValues(0.1, 0, "$lte")).to.be.false;
        expect(compareValues(1 / 1000000000000000, 1 / 1000000000000001, "$lte")).to.be.false;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, "$lte")).to.be.false;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.MAX_VALUE, "$lte")).to.be.false;
      });
      it(`returns true if item value is lower than query value`, () => {
        expect(compareValues(0, 1, "$lte")).to.be.true;
        expect(compareValues(0.1, 1.0, "$lte")).to.be.true;
        expect(compareValues(0, 0.000000000000000000000000001, "$lte")).to.be.true;
        expect(compareValues(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, "$lte")).to.be.true;
        expect(compareValues(Number.MAX_VALUE, Number.POSITIVE_INFINITY, "$lte")).to.be.true;
      });
    });
    context(`with booleans`, () => {
      it(`returns true if itemValue is false and queryValue is true`, () => {
        expect(compareValues(false, true, "$lte")).to.be.true;
      });
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues(true, true, "$lte")).to.be.true;
        expect(compareValues(false, false, "$lte")).to.be.true;
      });
      it(`returns false if itemValue is true and queryValue is false`, () => {
        expect(compareValues(true, false, "$lte")).to.be.false;
      });
    });
    context(`with objects`, () => {
      it(`returns true if both are strictly the same instance`, () => {
        const a = { a: 1, b: 2 };
        const b = { a: a };
        expect(compareValues(a, a, "$lte")).to.be.true;
        expect(compareValues(a, b.a, "$lte")).to.be.true;
      });
      it(`returns true if both are different but don't have a specific "valueOf" method on their prototype`, () => {
        const a = { a: 1, b: 2 };
        const b = { a: a };
        expect(compareValues(a, b, "$lte")).to.be.true;
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

        expect(compareValues(a, a, "$lte")).to.be.true;
        expect(compareValues(a, b.a, "$lte")).to.be.true;
        expect(compareValues(a, c, "$lte")).to.be.false;
        expect(compareValues(c, d, "$lte")).to.be.true;
        expect(compareValues(e, d, "$lte")).to.be.false;
        expect(compareValues(d, e, "$lte")).to.be.true;
        expect(compareValues(e, 85, "$lte")).to.be.true;
      });
    });
  });
  context(`with values of different types`, () => {
    it(`does what it wants ...`, () => {
      expect(compareValues("1", 1, "$lte")).to.be.true;
      expect(compareValues(1, "1", "$lte")).to.be.true;

      expect(compareValues("true", true, "$lte")).to.be.false;
      expect(compareValues(true, "true", "$lte")).to.be.false;

      expect(compareValues("", null, "$lte")).to.be.true;
      expect(compareValues(null, "", "$lte")).to.be.true;


      expect(compareValues("", undefined, "$lte")).to.be.false;
      expect(compareValues(undefined, "", "$lte")).to.be.false;

      expect(compareValues("", 0, "$lte")).to.be.true;
      expect(compareValues(0, "", "$lte")).to.be.true;

      expect(compareValues("", false, "$lte")).to.be.true;
      expect(compareValues(false, "", "$lte")).to.be.true;

      expect(compareValues(85, "75", "$lte")).to.be.false;
      expect(compareValues(65, "75", "$lte")).to.be.true;
    });
  });
});

