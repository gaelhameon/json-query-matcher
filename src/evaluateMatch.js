const _ = require('lodash');

function evaluateMatch(item, query) {
  return Object.keys(query).every(queryKey => {
    const queryValue = query[queryKey];
    switch (queryKey) {
      case "$or":
        return evaluateOr(item, queryValue);
      default:
        switch (typeof queryValue) {
          case `object`:
            const querySubKeys = Object.keys(queryValue);
            if (querySubKeys.some(querySubKey => querySubKey[0] === "$")) {
              if (querySubKeys.length > 1) throw new Error(`Only one key is supported if there is a $ key in an object.`);
              const querySubKey = querySubKeys[0];
              const querySubValue = queryValue[querySubKey];
              switch (querySubKey) {
                case "$or":
                  if (!Array.isArray(querySubValue)) throw new Error(`Value of a $or key should be an array. Got ${typeof querySubValue} ${querySubValue}`);
                  const orQueries = querySubValue.map(querySubSubValue => ({ [queryKey]: querySubSubValue }));
                  return evaluateOr(item, orQueries);
                default:
                  throw new Error(`Not supported yet`);
              }
            }
            else {
              const itemValue = _.get(item, queryKey);
              return evaluateMatch(itemValue, queryValue);
            }
          default:
            const itemValue = _.get(item, queryKey);
            return itemValue === queryValue;
        }
    }
  });
}

function evaluateOr(item, orQueries) {
  if (!Array.isArray(orQueries)) throw new Error(`Value of a $or key should be an array. Got ${typeof orQueries} ${orQueries}`);
  return orQueries.some(orQuery => {
    return evaluateMatch(item, orQuery);
  });
}

module.exports = evaluateMatch;