const log4js = require('log4js');
log4js.configure({
  appenders: {
    out: { type: 'stdout' },
  },
  categories: {
    default: { appenders: ['out'], level: 'trace' }
  }
});

const { expect } = require('chai');


const { evaluateMatch } = require('../../index');

describe.only('readmeExamples', () => {
  it(`works!`, () => {
    // const { evaluateMatch } = require('ookpik-query-matcher');

    const items = [
      { firstName: "Gaël", lastName: "Haméon" },
      { firstName: "Gaël", lastName: "Monfils" },
      { firstName: "Alix", lastName: "Haméon" }
    ]

    let query, result;

    query = { "firstName": "Gaël" };
    result = items.filter(item => evaluateMatch(item, query));
    expect(result).to.eql([{ firstName: "Gaël", lastName: "Haméon" }, { firstName: "Gaël", lastName: "Monfils" }]);

    query = { "lastName": "Haméon" };
    result = items.filter(item => evaluateMatch(item, query));
    expect(result).to.eql([{ firstName: "Gaël", lastName: "Haméon" }, { firstName: "Alix", lastName: "Haméon" }]);

    query = { "firstName": "Gaël", "lastName": "Haméon" };
    result = items.filter(item => evaluateMatch(item, query));
    expect(result).to.eql([{ firstName: "Gaël", lastName: "Haméon" }]);

    query = { "$or": [{ "firstName": "Alix" }, { "lastName": "Monfils" }] };
    result = items.filter(item => evaluateMatch(item, query));
    expect(result).to.eql([{ firstName: "Gaël", lastName: "Monfils" }, { firstName: "Alix", lastName: "Haméon" }]);

    query = { "firstName": { "$ne": "Gaël" } };
    result = items.filter(item => evaluateMatch(item, query));
    expect(result).to.eql([{ firstName: "Alix", lastName: "Haméon" }]);
  });
});

