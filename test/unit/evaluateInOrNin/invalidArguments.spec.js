const { expect } = require('chai');

const evaluateInOrNin = require('../../../src/comparisonFunctions/evaluateInOrNin');
const Logger = require('../../../src/logger/ConsoleLogger');
const logger = new Logger({level: 'off'});

describe('evaluateInOrNin - invalid args', () => {
  it(`throws if queryValues is not an array`, () => {
    expect(() => evaluateInOrNin("Allo", "Allo", "$nin", logger)).to.throw();
    expect(() => evaluateInOrNin("Allo", new Set(['Allo']), "$in", logger)).to.throw();

  });
  it(`throws if the operator is not $in or $nin`, () => {
    expect(() => evaluateInOrNin("Allo", ["Allo"], "$eq", logger)).to.throw();
  });
});