const { expect } = require('chai');

const compareValues = require('../../../src/comparisonFunctions/compareValues');

describe('compareValues - invalid arguments', () => {
  context(`with an unsupported operator`, () => {
    it(`throws`, () => {
      expect(() => {compareValues("toto", "titi", "$crazyNewOperator")}).to.throw();
    });
  });
});

