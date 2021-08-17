const { expect } = require('chai');

const evaluateInOrNin = require('../../../src/comparisonFunctions/evaluateInOrNin');
const Logger = require('../../../src/logger/ConsoleLogger');
const logger = new Logger({level: 'off'});

describe('evaluateInOrNin - $nin operator', () => {
  it(`returns false if item value is included in query values`, () => {
    expect(evaluateInOrNin("Allo", ["Allo"], "$nin", logger)).to.be.false;
    expect(evaluateInOrNin("Allo", ["alli", "Allo"], "$nin", logger)).to.be.false;
    const a = [1, 2, 3];
    expect(evaluateInOrNin(a, ["Allo", a], "$nin", logger)).to.be.false;
  });
  it(`returns true otherwise`, () => {
    expect(evaluateInOrNin("Allo", ["allo", "alli"], "$nin", logger)).to.be.true;
    expect(evaluateInOrNin("", [], "$nin", logger)).to.be.true;
    expect(evaluateInOrNin(null, [], "$nin", logger)).to.be.true;
    expect(evaluateInOrNin(undefined, [], "$nin", logger)).to.be.true;
  });
});