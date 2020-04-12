const _ = require('lodash');

// since there are circular dependencies, the export has to be first
module.exports =  evaluateMatch;

const evaluateField = require('./evaluateField');
const evaluateOr = require('./evaluateOr');

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
                case "$ne":
                  if (typeof querySubValue === 'object') throw new Error(`Only plain values should be used with $ne`);
                  return evaluateField(item, queryKey, querySubValue, "$ne");
                default:
                  throw new Error(`Not supported yet`);
              }
            }
            else {
              const itemValue = _.get(item, queryKey);
              return evaluateMatch(itemValue, queryValue);
            }
          default:
            return evaluateField(item, queryKey, queryValue, "$eq");
        }
    }
  });
}