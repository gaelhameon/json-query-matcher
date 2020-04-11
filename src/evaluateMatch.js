const _ = require('lodash');

function evaluateMatch(item, query) {
  return Object.keys(query).every(queryKey => {
    const queryValue = query[queryKey];
    switch (queryKey) {
      case "$or":
        if (!Array.isArray(queryValue)) throw new Error(`Value of a $or key should be an array. Got ${typeof queryValue}`);
        return queryValue.some(orSubQuery => {
          return evaluateMatch(item, orSubQuery);
        });

      default:
        const itemValue = _.get(item, queryKey);
        return itemValue === queryValue;
    }
  });
}

module.exports = evaluateMatch;