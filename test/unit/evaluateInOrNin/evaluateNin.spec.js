const { expect } = require('chai');

const evaluateInOrNin = require('../../../src/evaluateInOrNin');

describe('evaluateInOrNin - $nin operator', () => {
  it(`returns false if item value is included in query values`, () => {
    expect(evaluateInOrNin("Allo", ["Allo"], "$nin")).to.be.false;
    expect(evaluateInOrNin("Allo", ["alli", "Allo"], "$nin")).to.be.false;
    const a = [1, 2, 3];
    expect(evaluateInOrNin(a, ["Allo", a], "$nin")).to.be.false;
  });
  it(`returns true otherwise`, () => {
    expect(evaluateInOrNin("Allo", ["allo", "alli"], "$nin")).to.be.true;
    expect(evaluateInOrNin("", [], "$nin")).to.be.true;
    expect(evaluateInOrNin(null, [], "$nin")).to.be.true;
    expect(evaluateInOrNin(undefined, [], "$nin")).to.be.true;
  });
});