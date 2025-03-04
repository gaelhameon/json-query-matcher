const { expect } = require('chai');

const evaluateInOrNin = require('../../../src/comparisonFunctions/evaluateInOrNin');
const Logger = require('../../../src/logger/ConsoleLogger');
const logger = new Logger({level: 'trace'});

describe('evaluateInOrNin - $in operator', () => {
  it(`returns true if item value is included in query values`, () => {
    expect(evaluateInOrNin("Allo", ["Allo"], "$in", logger)).to.be.true;
    expect(evaluateInOrNin("Allo", ["alli", "Allo"], "$in", logger)).to.be.true;
    const a = [1, 2, 3];
    expect(evaluateInOrNin(a, ["Allo", a], "$in", logger)).to.be.true;
  });
  it(`returns false otherwise`, () => {
    expect(evaluateInOrNin("Allo", ["allo", "alli"], "$in", logger)).to.be.false;
    expect(evaluateInOrNin("", [], "$in", logger)).to.be.false;
    expect(evaluateInOrNin(null, [], "$in", logger)).to.be.false;
    expect(evaluateInOrNin(undefined, [], "$in", logger)).to.be.false;
  });
});