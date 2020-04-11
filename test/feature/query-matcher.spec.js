const { expect } = require('chai');

const { evaluateMatch } = require('../../index');

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
  });
  context('given an invalid query object', () => {
    it('throws (bad root $or)', () => {
      const query = { "$or": "value1" };
      expect(() => evaluateMatch({}, query)).to.throw();
    });
    it('throws (bad value $or)', () => {
      const query = { key1: { $or: "value2" } };
      expect(() => evaluateMatch({}, query)).to.throw();
    });
    it('throws (unspported query)', () => {
      const query = { key1: { toto: "value2" } };
      expect(() => evaluateMatch({}, query)).to.throw();
    });
  });
});

