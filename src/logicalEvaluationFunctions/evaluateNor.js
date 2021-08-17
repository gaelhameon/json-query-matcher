const { inspect } = require('util');

const evaluateMatch = require('../recursiveEvaluateMatch');

function evaluateNor(item, norQueries, parentLogger) {
    const logger = parentLogger.getChildLogger('evaluateNor');
    logger.trace(() => `item: ${inspect(item)}`);
    logger.trace(() => `norQueries: ${inspect(norQueries)}`);
    if (!Array.isArray(norQueries)) throw new Error(`Value of a $nor key should be an array. Got ${typeof norQueries} ${norQueries}`);
    const norResult = norQueries.every(norSubQuery => {
        const subResult = evaluateMatch(item, norSubQuery, parentLogger);
        logger.trace(() => `result is ${subResult} for norSubQuery ${JSON.stringify(norSubQuery)} on item ${inspect(item)}`);
        return !subResult;
    });
    logger.debug(() => `result is ${norResult} for norQueries ${JSON.stringify(norQueries)} on item ${inspect(item)}`);
    return norResult;
}

module.exports = evaluateNor;