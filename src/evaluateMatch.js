const _ = require('lodash');

function evaluateMatch(item, query) {
  return Object.keys(query).every(queryKey => {
    const queryValue = query[queryKey];
    const itemValue = _.get(item, queryKey);
    return itemValue === queryValue;
  });
}

module.exports = evaluateMatch;