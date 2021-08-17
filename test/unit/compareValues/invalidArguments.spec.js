const { expect } = require('chai');

const compareValues = require('../../../src/comparisonFunctions/compareValues');
const Logger = require('../../../src/logger/ConsoleLogger');
const logger = new Logger({level: 'off'});

describe('compareValues - invalid arguments', () => {
  context(`with an unsupported operator`, () => {
    it(`throws`, () => {
      expect(() => {compareValues("toto", "titi", "$crazyNewOperator", logger)}).to.throw();
    });
  });
});

