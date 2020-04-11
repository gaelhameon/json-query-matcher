const { expect } = require('chai');

const { evaluateMatch } = require('../../index');

describe('evaluateMatch', () => {
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
  context.skip('given a valid query object a valid item', () => {
    const query = { "$or": [{ "firstTripPoint.trpptPlace": "SXR1" }, { "lastTripPoint.trpptPlace": "SXR2" }] };
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
});

