const { expect } = require('chai');

const { evaluateMatch } = require('../../index');

describe('readmeExamples', () => {
  it(`Usage examples work`, () => {
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
  it(`Dot notation examples work`, () => {
    const item = {
      "trip": {
        "trpNumber": "123456",
        "trpType": "1",
        "tripPoints": [
          {
            "trpptPlace": {
              "code": "CJV",
              "name": "Cergy-le-Haut"
            },
            "trpptArrivalTime": "09:35:15",
            "trpptDepartureTime": "09:35:50"
          },
          {
            "trpptPlace": {
              "code": "CJP",
              "name": "Cergy-Préfecture"
            },
            "trpptArrivalTime": "09:40:00",
            "trpptDepartureTime": "09:40:50"
          }
        ]
      },
      "block": {}
    };
    const query = { "trip.tripPoints.1.trpptPlace.name": `Cergy-Préfecture` };
    expect(evaluateMatch(item, query)).to.be.true;
  });
  it(`Array example 1 works`, () => {
    const item = {
      firstName: "Gaël",
      lastName: "Haméon",
      nickNames: ["Gaga", "Galinou"],
    };
  
    const query1 = { nickNames: "Gaga" };
    const result1 = evaluateMatch(item, query1);
    expect(result1).to.eql(true);
  
    const query2 = { nickNames: { $in: ["Galinou", "Alixou"] } };
    const result2 = evaluateMatch(item, query2);
    expect(result2).to.eql(true);
  }); 
  it(`Array example 2 works`, () => {
    const item = {
      firstName: "Gaël",
      lastName: "Haméon",
      pets: [
        {
          name: "César",
          species: "Dog"
        },
        {
          name: "Capsule",
          species: "Cat"
        }
      ]
    };
    
    const query1 = { pets: {"name": "César", "species": "Cat"} };
    const result1 = evaluateMatch(item, query1);
    expect(result1).to.eql(true);
  });
  it(`Array example 3 works`, () => {
    const item = {
      firstName: "Gaël",
      lastName: "Haméon",
      pets: [
        {
          name: "César",
          species: "Dog"
        },
        {
          name: "Capsule",
          species: "Cat"
        }
      ]
    };
    
    const query1 = { pets: { $elemMatch: {"name": "César", "species": "Cat"} } };
    const result1 = evaluateMatch(item, query1);
    expect(result1).to.eql(false);
  });
});

