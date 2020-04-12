const { expect } = require('chai');

const evaluateInOrNin = require('../../../src/evaluateInOrNin');

describe('evaluateInOrNin - invalid args', () => {
  it(`throws if queryValues is not an array`, () => {
    expect(() => evaluateInOrNin("Allo", "Allo", "$nin")).to.throw();
    expect(() => evaluateInOrNin("Allo", new Set(['Allo']), "$in")).to.throw();

  });
  it(`throws if the operator is not $in or $nin`, () => {
    expect(() => evaluateInOrNin("Allo", ["Allo"], "$eq")).to.throw();
  });
});