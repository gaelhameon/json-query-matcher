const { expect } = require('chai');

const compareValues = require('../../../src/compareValues');

describe('compareValues - $gt operator', () => {
  context(`with two values of the same type`, () => {
    context(`with strings`, () => {
      it(`returns false if both are strictly equal`, () => {
        expect(compareValues("Allo", "Allo", "$lt")).to.be.false;
        expect(compareValues("", "", "$lt")).to.be.false;
        expect(compareValues(`allo`, "allo", "$lt")).to.be.false;
        expect(compareValues(`${'al'}${'lo'}`, "allo", "$lt")).to.be.false;
        expect(compareValues(`${'al'}${'lo'}`, "a" + "llo", "$lt")).to.be.false;
        expect(compareValues(`$gt`, `$gt`, "$lt")).to.be.false;
      });
      it(`compares the strings using the lexicographical order`, () => {
        expect(compareValues("Allo", "All", "$lt")).to.be.false;
        expect(compareValues("Allo", "Alloah", "$lt")).to.be.true;
        expect(compareValues("allo", "Allo", "$lt")).to.be.false;
        expect(compareValues("Z", "A", "$lt")).to.be.false;
        expect(compareValues("a", "Z", "$lt")).to.be.false;
        expect(compareValues("2", "14", "$lt")).to.be.false;
      });
    });
    context(`with numbers`, () => {
      it(`returns false if both are equal`, () => {
        expect(compareValues(0, 0, "$lt")).to.be.false;
        expect(compareValues(0 + 2, 2, "$lt")).to.be.false;
        expect(compareValues(2.5, 5 / 2, "$lt")).to.be.false;
        expect(compareValues(2.500, 2.5, "$lt")).to.be.false;
        expect(compareValues(2.000, 2, "$lt")).to.be.false;
        expect(compareValues(Number.MAX_VALUE, Number.MAX_VALUE, "$lt")).to.be.false;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, "$lt")).to.be.false;
        expect(compareValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, "$lt")).to.be.false;
      });
      it(`returns false if item value is greater than query value`, () => {
        expect(compareValues(1, 0, "$lt")).to.be.false;
        expect(compareValues(0, -1, "$lt")).to.be.false;
        expect(compareValues(1.1, 1, "$lt")).to.be.false;
        expect(compareValues(0.1, 0, "$lt")).to.be.false;
        expect(compareValues(1 / 1000000000000000, 1 / 1000000000000001, "$lt")).to.be.false;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, "$lt")).to.be.false;
        expect(compareValues(Number.POSITIVE_INFINITY, Number.MAX_VALUE, "$lt")).to.be.false;
      });
      it(`returns true if item value is strictly lower than query value`, () => {
        expect(compareValues(0, 1, "$lt")).to.be.true;
        expect(compareValues(0.1, 1.0, "$lt")).to.be.true;
        expect(compareValues(0, 0.000000000000000000000000001, "$lt")).to.be.true;
        expect(compareValues(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, "$lt")).to.be.true;
        expect(compareValues(Number.MAX_VALUE, Number.POSITIVE_INFINITY, "$lt")).to.be.true;
      });
    });
    context(`with booleans`, () => {
      it(`returns true if itemValue is false and queryValue is true`, () => {
        expect(compareValues(false, true, "$lt")).to.be.true;
      });
      it(`returns false otherwise`, () => {
        expect(compareValues(true, false, "$lt")).to.be.false;
        expect(compareValues(false, false, "$lt")).to.be.false;
        expect(compareValues(true, true, "$lt")).to.be.false;
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

        expect(compareValues(a, a, "$lt")).to.be.false;
        expect(compareValues(a, b.a, "$lt")).to.be.false;
        expect(compareValues(a, b, "$lt")).to.be.false;
        expect(compareValues(a, c, "$lt")).to.be.false;
        expect(compareValues(c, d, "$lt")).to.be.false;
        expect(compareValues(e, d, "$lt")).to.be.false;
        expect(compareValues(d, e, "$lt")).to.be.true;
        expect(compareValues(e, 85, "$lt")).to.be.true;
      });
    });
  });
  context(`with values of different types`, () => {
    it(`does what it wants ...`, () => {
      expect(compareValues("1", 1, "$lt")).to.be.false;
      expect(compareValues(1, "1", "$lt")).to.be.false;

      expect(compareValues("false", false, "$lt")).to.be.false;
      expect(compareValues(false, "false", "$lt")).to.be.false;

      expect(compareValues("", null, "$lt")).to.be.false;
      expect(compareValues(null, "", "$lt")).to.be.false;


      expect(compareValues("", undefined, "$lt")).to.be.false;
      expect(compareValues(undefined, "", "$lt")).to.be.false;

      expect(compareValues("", 0, "$lt")).to.be.false;
      expect(compareValues(0, "", "$lt")).to.be.false;

      expect(compareValues("", true, "$lt")).to.be.true;
      expect(compareValues(true, "", "$lt")).to.be.false;

      expect(compareValues(85, "75", "$lt")).to.be.false;
      expect(compareValues(65, "75", "$lt")).to.be.true;
    });
  });
});

