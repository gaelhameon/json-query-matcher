const { expect } = require('chai');

const evaluateInOrNin = require('../../../src/evaluateInOrNin');

describe('evaluateInOrNin - $in operator', () => {
  it(`returns true if item value is included in query values`, () => {
    expect(evaluateInOrNin("Allo", ["Allo"], "$in")).to.be.true;
    expect(evaluateInOrNin("Allo", ["alli", "Allo"], "$in")).to.be.true;
    const a = [1, 2, 3];
    expect(evaluateInOrNin(a, ["Allo", a], "$in")).to.be.true;
  });
  it(`returns false otherwise`, () => {
    expect(evaluateInOrNin("Allo", ["allo", "alli"], "$in")).to.be.false;
    expect(evaluateInOrNin("", [], "$in")).to.be.false;
    expect(evaluateInOrNin(null, [], "$in")).to.be.false;
    expect(evaluateInOrNin(undefined, [], "$in")).to.be.false;
  });
});