const log4js = require('@log4js-node/log4js-api');
const logger = log4js.getLogger('json-query-matcher.evaluateMatch');

// since there are circular dependencies, the export has to be first
module.exports = evaluateMatch;

const compareValues = require('./compareValues');
const evaluateInOrNin = require('./evaluateInOrNin');
const getItemValue = require('./getItemValue');
const evaluateOr = require('./evaluateOr');

const compareValuesFunctionByComparisonOperator = {
  $eq: compareValues,
  $ne: compareValues,
  $gt: compareValues,
  $gte: compareValues,
  $lt: compareValues,
  $lte: compareValues,
  $in: evaluateInOrNin,
  $nin: evaluateInOrNin,
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
      return queryKeys.every(queryKey => {
        const queryValue = query[queryKey];
        logger.trace(`Evaluating key ${queryKey} with value: ${queryValue}`);

        const compareValuesFunction = compareValuesFunctionByComparisonOperator[queryKey];
        if (compareValuesFunction) {
          logger.trace(`Comparison operator ${queryKey} detected. Will use function ${compareValuesFunction.name}`);
          return compareValuesFunction(item, queryValue, queryKey);
        }

        const logicalEvaluationFunction = logicalEvaluationFunctionByLogicalOperator[queryKey];
        if (logicalEvaluationFunction) {
          logger.trace(`Logical operator ${queryKey} detected. Will use function ${logicalEvaluationFunction.name}`);
          return logicalEvaluationFunction(item, queryValue);
        }

        logger.trace(`No operator detected. Will evaluate match.`);
        return evaluateMatch(getItemValue(item, queryKey), query[queryKey])
      });
    default:
      return compareValues(item, query, "$eq");
  }
}