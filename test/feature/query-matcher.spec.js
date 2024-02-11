const { expect } = require('chai');

const { evaluateMatch } = require('../../index');

const Logger = require('../../src/logger/ConsoleLogger');
const logger = new Logger({level: 'off'});

describe('evaluateMatch', () => {
  context('given a valid query object', () => {
    context('given a very simple query object and a valid item', () => {
      const query = { "key1": "value1" };
      it('returns true if the item matches the query', () => {
        const item = { "key1": "value1", "key2": "value2", key3: "value3" };
        expect(evaluateMatch(item, query)).to.equal(true);
      });
      it('returns true if the item matches the query', () => {
        const item = { key1: "value1", "key2": "value2", key3: "value3" };
        expect(evaluateMatch(item, query)).to.equal(true);
      });
      it('returns false if the item does not match the query', () => {
        const item = { "key1": "otherValue", "key2": "value2", key3: "value3" };
        expect(evaluateMatch(item, query)).to.equal(false);
      });
      it('returns false if the item is empty', () => {
        const item = {};
        expect(evaluateMatch(item, query)).to.equal(false);
      });
      it('returns false if the item has undefined keys not match the query', () => {
        const item = { "key2": "toto" };
        expect(evaluateMatch(item, query)).to.equal(false);
      });
    });
    context('given a very simple query object and an item that has a circular structure', () => {
      const query = { "key1": "value1" };
      it('returns true if the item matches the query', () => {
        const subItem = { key1: "subValue1"};
        const item = { "key1": "value1", "key2": "value2", key3: subItem };
        subItem.parent = item;
        expect(evaluateMatch(item, query)).to.equal(true);
      });
    });
    context('given a simple query object and a valid item', () => {
      const query = { "key1": "value1", "key2": "value2" };
      it('returns true if the item matches the query', () => {
        const item = { "key1": "value1", "key2": "value2", key3: "value3" };
        expect(evaluateMatch(item, query)).to.equal(true);
      });
      it('returns false if the item does not match the query', () => {
        const item = { "key1": "otherValue", "key2": "value2", key3: "value3" };
        expect(evaluateMatch(item, query)).to.equal(false);
      });
      it('returns false if the item does not match the query', () => {
        const item = { "key1": "value1", "key2": "badValue", key3: "value3" };
        expect(evaluateMatch(item, query)).to.equal(false);
      });
      it('returns false if the item is empty', () => {
        const item = {};
        expect(evaluateMatch(item, query)).to.equal(false);
      });
      it('returns false if the item has undefined keys not match the query', () => {
        const item = { "key2": "toto" };
        expect(evaluateMatch(item, query)).to.equal(false);
      });
    });
    context('given a simple query object that queries an array in the item', () => {
      const query = { "key1": "value1" };
      it('returns true if at least one value of the array matches the query', () => {
        const item = { "key1": ["value1"], "key2": "value2", key3: "value3" };
        expect(evaluateMatch(item, query, logger)).to.equal(true);
      });
    });
    context('given a compound query object that queries an array in the item', () => {
      const query = { "key1": {"subKey1": "val1", "subKey2": "val2"} };
      it('returns true if a combination of the values of the array matches the query', () => {
        const item = { "key1": [
          {"subKey1": "val0", "subKey2": "val2", "subKey3": "val3"},
          {"subKey1": "val1", "subKey2": "val0", "subKey3": "val3"},
        ], "key2": "value2", key3: "value3" };
        expect(evaluateMatch(item, query, logger)).to.equal(true);
      });
    });
    context('given a query object that use $elemMatch to query an array in the item', () => {
      const query = { "key1": { $elemMatch: {"subKey1": "val1", "subKey2": "val2"}} };
      it('returns true if at least one of the elements of array matches all parts of the query', () => {
        const item1 = { "key1": [
          {"subKey1": "val0", "subKey2": "val2", "subKey3": "val3"},
          {"subKey1": "val1", "subKey2": "val0", "subKey3": "val3"},
        ], "key2": "value2", key3: "value3" };
        expect(evaluateMatch(item1, query, logger)).to.equal(false);

        const item2 = { "key1": [
          {"subKey1": "val1", "subKey2": "val2", "subKey3": "val3"},
          {"subKey1": "val1", "subKey2": "val0", "subKey3": "val3"},
        ], "key2": "value2", key3: "value3" };
        expect(evaluateMatch(item2, query, logger)).to.equal(true);
      });
    });
    context('given a deep query object and a valid item', () => {
      const query = { "firstTripPoint.trpptPlace": "SXR1", "lastTripPoint.trpptPlace": "SXR2" };
      it('returns true if the item matches the query', () => {
        const item = {
          firstTripPoint: {
            trpptPlace: "SXR1",
          },
          lastTripPoint: {
            trpptPlace: "SXR2"
          }
        };
        expect(evaluateMatch(item, query)).to.equal(true);
      });
      it('returns false if the item does not match the query', () => {
        const item = {
          firstTripPoint: {
            trpptPlace: "NAF1",
          },
          lastTripPoint: {
            trpptPlace: "NAF2"
          }
        };
        expect(evaluateMatch(item, query)).to.equal(false);
      });
    });
    context('given a query object with a $ne and a valid item', () => {
      const query = { "firstTripPoint.trpptPlace": { $ne: "SXR1" } };
      it('returns true if the item matches the query', () => {
        const item1 = {
          firstTripPoint: {
            trpptPlace: "SXR2",
          }
        };
        const item2 = {
          firstTripPoint: {}
        };
        const item3 = {}
        expect(evaluateMatch(item1, query)).to.equal(true);
        expect(evaluateMatch(item2, query)).to.equal(true);
        expect(evaluateMatch(item3, query)).to.equal(true);
      });
      it('returns false if the item does not match the query', () => {
        const item = {
          firstTripPoint: {
            trpptPlace: "SXR1",
          }
        };
        expect(evaluateMatch(item, query)).to.equal(false);
      });
    });
    context('given a query object with a $ne and other fields and a valid item', () => {
      const query = {
        "firstTripPoint.trpptPlace": { $ne: "SXR1" },
        "firstTripPoint.trpptNoStopping": "1",
      };
      it('returns true if the item matches the query', () => {
        const item1 = {
          firstTripPoint: {
            trpptPlace: "SXR2",
            trpptNoStopping: "1",
          }
        };
        const item2 = {
          firstTripPoint: { trpptNoStopping: "1" }
        };
        expect(evaluateMatch(item1, query)).to.equal(true);
        expect(evaluateMatch(item2, query)).to.equal(true);
      });
      it('returns false if the item does not match the query', () => {
        const item1 = {
          firstTripPoint: {
            trpptPlace: "SXR1",
          }
        };
        const item2 = {
          firstTripPoint: {
            trpptPlace: "SXR2",
            trpptNoStopping: "0",
          }
        };
        const item3 = {}
        expect(evaluateMatch(item1, query)).to.equal(false);
        expect(evaluateMatch(item2, query)).to.equal(false);
        expect(evaluateMatch(item3, query)).to.equal(false);
      });
    });
    context('given a query object with $or at the root and a valid item', () => {
      const query = { "$or": [{ "firstTripPoint.trpptPlace": "SXR1" }, { "lastTripPoint.trpptPlace": "SXR2" }] };
      it('returns true if the item matches the query', () => {
        const item = {
          firstTripPoint: {
            trpptPlace: "SXR1",
          },
          lastTripPoint: {
            trpptPlace: "NAF1"
          }
        };
        expect(evaluateMatch(item, query)).to.equal(true);
      });
      it('returns true if the item matches the query', () => {
        const item = {
          firstTripPoint: {
            trpptPlace: "NAF2",
          },
          lastTripPoint: {
            trpptPlace: "SXR2"
          }
        };
        expect(evaluateMatch(item, query)).to.equal(true);
      });
      it('returns false if the item does not match the query', () => {
        const item = {
          firstTripPoint: {
            trpptPlace: "CJV1",
          },
          lastTripPoint: {
            trpptPlace: "NAF1C"
          }
        };
        expect(evaluateMatch(item, query)).to.equal(false);
      });
    });
    context('given a query object with $or not at the root and a valid item', () => {
      const query = { "firstTripPoint.trpptPlace": { "$or": ["SXR1", "SXR2"] } };
      it('returns true if the item matches the query', () => {
        const item1 = {
          firstTripPoint: {
            trpptPlace: "SXR1",
          },
        };
        const item2 = {
          firstTripPoint: {
            trpptPlace: "SXR2",
          },
        };
        expect(evaluateMatch(item1, query)).to.equal(true);
        expect(evaluateMatch(item2, query)).to.equal(true);
      });
      it('returns false if the item does not match the query', () => {
        const item = {
          firstTripPoint: {
            trpptPlace: "CJV1",
          },
          lastTripPoint: {
            trpptPlace: "NAF1C"
          }
        };
        expect(evaluateMatch(item, query)).to.equal(false);
      });
    });
    context('given a query object with multiple nested ors and a valid item', () => {
      const query = {
        $or: [
          { "firstTripPoint.trpptPlace": { "$or": ["SXR1", "SXR2"] } },
          {
            "lastTripPoint": {
              $or: [
                { trpptPlace: "NAF2", trpptNoStopping: "1" },
                { trpptPlace: "NAF1", trpptNoStopping: "0" },
              ]
            }
          }
        ]
      };
      it('returns true if the item matches the query', () => {
        const item1 = {
          firstTripPoint: {
            trpptPlace: "SXR1",
          },
        };
        const item2 = {
          firstTripPoint: {
            trpptPlace: "SXR2",
          },
        };
        const item3 = {
          lastTripPoint: {
            trpptPlace: "NAF2",
            trpptNoStopping: "1"
          },
        };
        const item4 = {
          lastTripPoint: {
            trpptPlace: "NAF1",
            trpptNoStopping: "0"
          },
        };
        expect(evaluateMatch(item1, query)).to.equal(true);
        expect(evaluateMatch(item2, query)).to.equal(true);
        expect(evaluateMatch(item3, query)).to.equal(true);
        expect(evaluateMatch(item4, query)).to.equal(true);
      });
      it('returns false if the item does not match the query', () => {
        const item1 = {
          firstTripPoint: {
            trpptPlace: "CJV1",
          },
          lastTripPoint: {
            trpptPlace: "NAF1C"
          }
        };
        const item2 = {
          lastTripPoint: {
            trpptPlace: "NAF1",
            trpptNoStopping: "1"
          },
        };
        expect(evaluateMatch(item1, query)).to.equal(false);
        expect(evaluateMatch(item2, query)).to.equal(false);
      });
    });
    context('given a query object with multiple nested ors and some $gt/$lt and a valid item', () => {
      const query = {
        $or: [
          { "firstTripPoint.trpptPlace": { "$or": ["SXR1", "SXR2"] } },
          {
            "lastTripPoint": {
              $or: [
                { trpptPlace: "NAF2", trpptNoStopping: "1", trpptRank: { $gt: 3 } },
                { trpptPlace: "NAF1", trpptNoStopping: "0", trpptRank: { $lte: 5 } },
              ]
            }
          }
        ]
      };
      it('returns true if the item matches the query', () => {
        const item1 = {
          firstTripPoint: {
            trpptPlace: "SXR1",
          },
        };
        const item2 = {
          firstTripPoint: {
            trpptPlace: "SXR2",
          },
        };
        const item3 = {
          lastTripPoint: {
            trpptPlace: "NAF2",
            trpptNoStopping: "1",
            trpptRank: 4
          },
        };
        const item4 = {
          lastTripPoint: {
            trpptPlace: "NAF1",
            trpptNoStopping: "0",
            trpptRank: 5
          },
        };
        const item5 = {
          lastTripPoint: {
            trpptPlace: "NAF1",
            trpptNoStopping: "0",
            trpptRank: 2
          },
        };
        expect(evaluateMatch(item1, query)).to.equal(true);
        expect(evaluateMatch(item2, query)).to.equal(true);
        expect(evaluateMatch(item3, query)).to.equal(true);
        expect(evaluateMatch(item4, query)).to.equal(true);
        expect(evaluateMatch(item5, query)).to.equal(true);
      });
      it('returns false if the item does not match the query', () => {
        const item1 = {
          firstTripPoint: {
            trpptPlace: "CJV1",
          },
          lastTripPoint: {
            trpptPlace: "NAF1C"
          }
        };
        const item2 = {
          lastTripPoint: {
            trpptPlace: "NAF1",
            trpptNoStopping: "1"
          },
        };
        const item3 = {
          lastTripPoint: {
            trpptPlace: "NAF2",
            trpptNoStopping: "1",
            trpptRank: 3
          },
        };
        const item4 = {
          lastTripPoint: {
            trpptPlace: "NAF1",
            trpptNoStopping: "0",
            trpptRank: 6
          },
        };
        const item5 = {
          lastTripPoint: {
            trpptPlace: "NAF1",
            trpptNoStopping: "0",
          },
        };
        expect(evaluateMatch(item1, query)).to.equal(false);
        expect(evaluateMatch(item2, query)).to.equal(false);
        expect(evaluateMatch(item3, query)).to.equal(false);
        expect(evaluateMatch(item4, query)).to.equal(false);
        expect(evaluateMatch(item5, query)).to.equal(false);
      });
    });
    context('given a query object with some $and and some $gt/$lt and a valid item', () => {
      const query = {
        $and: [
          { $or: [{ trpNumber: `123456` }, { trpNumber: `234567` }] },
          { $or: [{ trpDistance: { $lt: 400 } }, { trpNumberOfPoints: { "$gte": 5 } }] }
        ]
      };
      it('returns true if the item matches the query', () => {
        const item1 = {
          trpNumber: '123456',
          trpDistance: 500,
          trpNumberOfPoints: 6
        };
        const item2 = {
          trpNumber: '234567',
          trpDistance: 300,
          trpNumberOfPoints: 2
        };
        const item3 = {
          trpNumber: '234567',
          trpDistance: 300,
          trpNumberOfPoints: 8
        };
        expect(evaluateMatch(item1, query)).to.equal(true);
        expect(evaluateMatch(item2, query)).to.equal(true);
        expect(evaluateMatch(item3, query)).to.equal(true);
      });
      it('returns false if the item does not match the query', () => {
        const item1 = {
          trpNumber: '123457',
          trpDistance: 500,
          trpNumberOfPoints: 6
        };
        const item2 = {
          trpNumber: '234567',
          trpDistance: 500,
          trpNumberOfPoints: 2
        };
        expect(evaluateMatch(item1, query)).to.equal(false);
        expect(evaluateMatch(item2, query)).to.equal(false);
      });
    });
    context('given a query object with a normal key and a or on the same level, and a valid item', () => {
      const query = {
        "firstTripPoint.trpptPlace": { "$or": ["SXR1", "SXR2"] },
        $or: [
          { "lastTripPoint.trpptPlace": "NAF2" },
          { "lastTripPoint.trpptNoStopping": "1" }
        ]
      };
      it('returns true if the item matches the query', () => {
        const item1 = {
          firstTripPoint: {
            trpptPlace: "SXR1",
          },
          lastTripPoint: {
            trpptPlace: "NAF2",
            trpptNoStopping: "0",
          },
        };
        const item2 = {
          firstTripPoint: {
            trpptPlace: "SXR2",
          },
          lastTripPoint: {
            trpptPlace: "NAF2",
            trpptNoStopping: "0",
          },
        };
        const item3 = {
          firstTripPoint: {
            trpptPlace: "SXR2",
          },
          lastTripPoint: {
            trpptPlace: "NAF1",
            trpptNoStopping: "1",
          },
        };
        expect(evaluateMatch(item1, query)).to.equal(true);
        expect(evaluateMatch(item2, query)).to.equal(true);
        expect(evaluateMatch(item3, query)).to.equal(true);
      });
      it('returns false if the item does not match the query', () => {
        const item1 = {
          firstTripPoint: {
            trpptPlace: "SXR3",
          },
          lastTripPoint: {
            trpptPlace: "NAF2",
            trpptNoStopping: "0",
          },
        };
        const item2 = {
          firstTripPoint: {
            trpptPlace: "SXR2",
          },
          lastTripPoint: {
            trpptPlace: "NAF1",
            trpptNoStopping: "0",
          },
        };
        const item3 = {
          firstTripPoint: {
            trpptPlace: "SXR2",
          },
        };
        expect(evaluateMatch(item1, query)).to.equal(false);
        expect(evaluateMatch(item2, query)).to.equal(false);
        expect(evaluateMatch(item3, query)).to.equal(false);
      });
    });
    context('given a query object with $in, and a valid item', () => {
      const query = {
        "firstTripPoint.trpptPlace": { "$in": ["SXR1", "SXR2"] },
      };
      it('returns true if item matches the query', () => {
        const item1 = {
          firstTripPoint: {
            trpptPlace: "SXR1",
          }
        };
        const item2 = {
          firstTripPoint: {
            trpptPlace: "SXR2",
          }
        };
        expect(evaluateMatch(item1, query)).to.equal(true);
        expect(evaluateMatch(item2, query)).to.equal(true);
      });
      it('returns false if the item does not match the query', () => {
        const item1 = {
          firstTripPoint: {
            trpptPlace: "SXR3",
          }
        };
        const item2 = {};
        expect(evaluateMatch(item1, query)).to.equal(false);
        expect(evaluateMatch(item2, query)).to.equal(false);
      });
    });
    context('given a query object with $nin, and a valid item', () => {
      const query = {
        "firstTripPoint.trpptPlace": { "$nin": ["SXR1", "SXR2"] },
      };
      it('returns false if item  does not match the query', () => {
        const item1 = {
          firstTripPoint: {
            trpptPlace: "SXR1",
          }
        };
        const item2 = {
          firstTripPoint: {
            trpptPlace: "SXR2",
          }
        };
        expect(evaluateMatch(item1, query)).to.equal(false);
        expect(evaluateMatch(item2, query)).to.equal(false);
      });
      it('returns true if the item matches the query', () => {
        const item1 = {
          firstTripPoint: {
            trpptPlace: "SXR3",
          }
        };
        const item2 = {};
        expect(evaluateMatch(item1, query)).to.equal(true);
        expect(evaluateMatch(item2, query)).to.equal(true);
      });
    });
    context('given a query object with $not, and a valid item', () => {
      const query = {
        "trpDistance": { "$not": { $gt: 300 } },
      };
      it('returns true if item matches the query', () => {
        const item1 = {
          trpDistance: 200
        };
        const item2 = {};
        expect(evaluateMatch(item1, query)).to.equal(true);
        expect(evaluateMatch(item2, query)).to.equal(true);
      });
      it('returns false if the item does not match the query', () => {
        const item1 = {
          trpDistance: 400
        };
        expect(evaluateMatch(item1, query)).to.equal(false);
      });
    });
    context('given a query object with $nor, and a valid item', () => {
      const query = {
        $nor: [
          { trpNumber: '123456' },
          { trpType: '0' }
        ]
      };
      it('returns true if item matches the query', () => {
        const item1 = {
          trpNumber: `234567`,
          trpType: "1"
        };
        const item2 = {
          trpType: "1"
        };
        const item3 = {
          trpNumber: `234567`,
        };
        const item4 = {};
        expect(evaluateMatch(item1, query)).to.equal(true);
        expect(evaluateMatch(item2, query)).to.equal(true);
        expect(evaluateMatch(item3, query)).to.equal(true);
        expect(evaluateMatch(item4, query)).to.equal(true);
      });
      it('returns false if the item does not match the query', () => {
        const item1 = {
          trpNumber: `123456`
        };
        const item2 = {
          trpType: `0`
        };
        const item3 = {
          trpNumber: `123456`,
          trpType: `0`
        };
        expect(evaluateMatch(item1, query)).to.equal(false);
        expect(evaluateMatch(item2, query)).to.equal(false);
        expect(evaluateMatch(item3, query)).to.equal(false);
      });
    });
  });
  context('given an invalid query object', () => {
    it('throws (or should have array)', () => {
      const query = { "$or": "value1" };
      expect(() => evaluateMatch({ key1: "tata" }, query)).to.throw();
    });
    it('throws (and should have array)', () => {
      const query = { "$and": "value1" };
      expect(() => evaluateMatch({ key1: "tata" }, query)).to.throw();
    });
    it('throws (nor should have array)', () => {
      const query = { "$nor": "value1" };
      expect(() => evaluateMatch({ key1: "tata" }, query)).to.throw();
    });
    it('throws (query shouldnt be empty object)', () => {
      const query = {};
      expect(() => evaluateMatch({ key1: "tata" }, query)).to.throw();
    });
    it('throws ($in should be array)', () => {
      const query = { key1: { $in: "tata" } };
      expect(() => evaluateMatch({ key1: "tata" }, query)).to.throw();
    });
  });
});

