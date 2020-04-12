const log4js = require('@log4js-node/log4js-api');
const logger = log4js.getLogger('json-query-matcher.evaluateMatch');

// since there are circular dependencies, the export has to be first
module.exports = evaluateMatch;

const compareValues = require('./compareValues');
const getItemValue = require('./getItemValue');
const evaluateOr = require('./evaluateOr');

function evaluateMatch(item, query) {
  logger.trace(`item: ${JSON.stringify(item)}`);
  logger.trace(`query: ${JSON.stringify(query)}`);

  switch (typeof query) {
    case `object`:
      const queryKeys = Object.keys(query);
      logger.trace(`Query is an object with the following keys: ${queryKeys}`);
      if (queryKeys.some(querySubKey => querySubKey[0] === "$")) {
        if (queryKeys.length > 1) throw new Error(`Only one key is supported if there is a $ key in an object.`);
        const queryKey = queryKeys[0];
        const queryValue = query[queryKey];
        switch (queryKey) {
          case "$or":
            return evaluateOr(item, queryValue);
          case "$ne":
            if (typeof queryValue === 'object') throw new Error(`Only plain values should be used with $ne`);
            return compareValues(item, queryValue, "$ne");
          default:
            throw new Error(`Not supported yet`);
        }
      }
      else {
        logger.trace(`No $ in query. Evaluating match`);
        return queryKeys.every(queryKey => evaluateMatch(getItemValue(item, queryKey), query[queryKey]));
      }
    default:
      return compareValues(item, query, "$eq");
  }
}