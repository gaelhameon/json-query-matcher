const log4js = require('@log4js-node/log4js-api');
const logger = log4js.getLogger('json-query-matcher.evaluateOr');
const { inspect } = require('util');

const evaluateMatch = require('../recursiveEvaluateMatch');

function evaluateOr(item, orQueries) {
    logger.trace(() => `item: ${inspect(item)}`);
    logger.trace(() => `orQueries: ${inspect(orQueries)}`);
    if (!Array.isArray(orQueries)) throw new Error(`Value of a $or key should be an array. Got ${typeof orQueries} ${orQueries}`);
    const orResult = orQueries.some(orSubQuery => {
        const subResult = evaluateMatch(item, orSubQuery);
        logger.trace(() => `result is ${subResult} for orSubQuery ${JSON.stringify(orSubQuery)} on item ${inspect(item)}`);
        return subResult;
    });
    logger.debug(() => `result is ${orResult} for orQueries ${JSON.stringify(orQueries)} on item ${inspect(item)}`);
    return orResult;
}

module.exports = evaluateOr;

