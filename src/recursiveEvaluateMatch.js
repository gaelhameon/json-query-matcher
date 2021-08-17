const { inspect } = require('util');

// since there are circular dependencies, the export has to be first
module.exports = recursiveEvaluateMatch;

const getItemValue = require('./getItemValue');
const compareValues = require('./comparisonFunctions/compareValues');
const compareValuesFunctionByComparisonOperator = require('./comparisonFunctionByComparisonOperator');
const logicalEvaluationFunctionByLogicalOperator = require('./logicalEvaluationFunctionByLogicalOperator');


/**
 * Recursively evaluates item against query. Returns true if item matches query, false otherwise.
 * @param {Any} item the item to evaluate against the query
 * @param {Any} query the query against which to evaluate the item
 * @param {Any} logger a logger
 * @returns {Boolean} true if item matches query, false otherwise
 */
function recursiveEvaluateMatch(item, query, rootLogger) {
  const logger = rootLogger.getChildLogger('recursiveEvaluateMatch');
  logger.trace(() => `item: ${inspect(item)}`);
  logger.trace(() => `query: ${inspect(query)}`);

  if (typeof query !== `object`) return compareValues(item, query, "$eq", rootLogger);

  const queryKeys = Object.keys(query);
  if (queryKeys.length === 0) throw new Error(`Query should have at least one key`);
  logger.trace(`Query is an object with the following keys: ${queryKeys}`);
  return queryKeys.every(queryKey => {
    const queryValue = query[queryKey];
    logger.trace(`Evaluating key ${queryKey} with value: ${queryValue}`);

    const compareValuesFunction = compareValuesFunctionByComparisonOperator[queryKey];
    if (compareValuesFunction) {
      logger.trace(`Comparison operator ${queryKey} detected. Will use function ${compareValuesFunction.name}`);
      return compareValuesFunction(item, queryValue, queryKey, rootLogger);
    }

    const logicalEvaluationFunction = logicalEvaluationFunctionByLogicalOperator[queryKey];
    if (logicalEvaluationFunction) {
      logger.trace(`Logical operator ${queryKey} detected. Will use function ${logicalEvaluationFunction.name}`);
      return logicalEvaluationFunction(item, queryValue, rootLogger);
    }

    logger.trace(`No operator detected. Will evaluate match.`);
    return recursiveEvaluateMatch(getItemValue(item, queryKey, rootLogger), query[queryKey], rootLogger)
  });
}