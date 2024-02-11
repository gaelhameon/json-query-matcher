const { inspect } = require('util');
const recursiveEvaluateMatch = require('../recursiveEvaluateMatch');


/**
 * Compares values using $in or $nin
 * @param {Any[]} arrayOfItems the value in the item
 * @param {object} queryValues the array of values in the query
 * @param {'$elemMatch'} operator the operator that brought us here
 * @param {Logger} parentLogger the logger
 * @returns {Boolean} the result of the evaluation
 */
function evaluateElemMatch(arrayOfItems, query, operator, parentLogger) {
    const logger = parentLogger.getChildLogger('evaluateElemMatch');

    logger.trace(`Will evaluate query ${inspect(query)} against each item individually`);
    
    return arrayOfItems.some((item) => recursiveEvaluateMatch(item, query, logger));
}

module.exports = evaluateElemMatch;