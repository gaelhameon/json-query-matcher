const { expect } = require('chai');

const compareValues = require('../../../src/compareValues');

describe('compareValues - $eq operator', () => {
  context(`with two values of the same type`, () => {
    context(`with strings`, () => {
      it(`returns true if both are strictly equal`, () => {
        expect(compareValues("Allo", "Allo", "$eq")).to.be.true;
        expect(compareValues("", "", "$eq")).to.be.true;
        expect(compareValues(`allo`, "allo", "$eq")).to.be.true;
        expect(compareValues(`${'al'}${'lo'}`, "allo", "$eq")).to.be.true;
        expect(compareValues(`${'al'}${'lo'}`, "a"+ "llo", "$eq")).to.be.true;
        expect(compareValues(`$eq`, `$eq`, "$eq")).to.be.true;
      });
      it(`returns false otherwise`, () => {
        expect(compareValues("Allo", "allo", "$eq")).to.be.false;
        expect(compareValues("Allo", "Allo ", "$eq")).to.be.false;
        expect(compareValues(" ", "", "$eq")).to.be.false;
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

