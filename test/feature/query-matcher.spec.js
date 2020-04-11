const { expect } = require('chai');

const { evaluateMatch } = require('../../index');

describe('evaluateMatch', () => {
  context('given a valid query object a valid item', () => {
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
          trpptPlace: "SXR1",
        },
        lastTripPoint: {
          trpptPlace: "SXR2"
        }
      };
      expect(evaluateMatch(item, query)).to.equal(false);
    });
  });
});

