const log4js = require('@log4js-node/log4js-api');
const logger = log4js.getLogger('json-query-matcher.evaluateMatch');

// since there are circular dependencies, the export has to be first
module.exports = evaluateMatch;

const compareValues = require('./compareValues');
const getItemValue = require('./getItemValue');
const evaluateOr = require('./evaluateOr');

const compareValuesFunctionByComparisonOperator = {
  $eq: compareValues,
  $ne: compareValues,
  $gt: compareValues,
  $gte: compareValues,
  $lt: compareValues,
  $lte: compareValues
};

const logicalEvaluationFunctionByLogicalOperator = {
  $or: evaluateOr,
};

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
        const compareValuesFunction = compareValuesFunctionByComparisonOperator[queryKey];
        if (compareValuesFunction) return compareValuesFunction(item, queryValue, queryKey);

        const logicalEvaluationFunction = logicalEvaluationFunctionByLogicalOperator[queryKey];
        if (logicalEvaluationFunction) return logicalEvaluationFunction(item, queryValue);

        throw new Error(`The ${queryKey} query key is not supported yet.`);
      }
      else {
        logger.trace(`No $ in query. Evaluating match`);
        return queryKeys.every(queryKey => evaluateMatch(getItemValue(item, queryKey), query[queryKey]));
      }
    default:
      return compareValues(item, query, "$eq");
  }
}