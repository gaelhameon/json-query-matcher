const { inspect } = require('util');

const evaluateMatch = require('../recursiveEvaluateMatch');

function evaluateAnd(item, andQueries, parentLogger) {
    const logger = parentLogger.getChildLogger('evaluateAnd');
    logger.trace(() => `item: ${inspect(item)}`);
    logger.trace(() => `andQueries: ${inspect(andQueries)}`);
    if (!Array.isArray(andQueries)) throw new Error(`Value of a $and key should be an array. Got ${typeof andQueries} ${andQueries}`);
    const andResult = andQueries.every(andSubQuery => {
        const subResult = evaluateMatch(item, andSubQuery, parentLogger);
        logger.trace(() => `result is ${subResult} for andSubQuery ${JSON.stringify(andSubQuery)} on item ${inspect(item)}`);
        return subResult;
    });
    logger.debug(() => `result is ${andResult} for andQueries ${JSON.stringify(andQueries)} on item ${inspect(item)}`);
    return andResult;
}

module.exports = evaluateAnd;