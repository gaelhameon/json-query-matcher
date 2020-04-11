const _ = require('lodash');

function evaluateMatch(item, query) {
  return Object.keys(query).every(queryKey => {
    const queryValue = query[queryKey];
    return item[queryKey] === queryValue;
  });
}

module.exports = evaluateMatch;