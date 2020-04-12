const log4js = require('@log4js-node/log4js-api');
const logger = log4js.getLogger('json-query-matcher.evaluateAnd');

const evaluateMatch = require('./evaluateMatch');

function evaluateAnd(item, andQueries) {
    logger.trace(`item: ${JSON.stringify(item)}`);
    logger.trace(`andQueries: ${JSON.stringify(andQueries)}`);
    if (!Array.isArray(andQueries)) throw new Error(`Value of a $and key should be an array. Got ${typeof andQueries} ${andQueries}`);
    const andResult = andQueries.every(andSubQuery => {
        const subResult = evaluateMatch(item, andSubQuery);
        logger.trace(`result is ${subResult} for andSubQuery ${JSON.stringify(andSubQuery)} on item ${JSON.stringify(item)}`);
        return subResult;
    });
    logger.debug(`result is ${andResult} for andQueries ${JSON.stringify(andQueries)} on item ${JSON.stringify(item)}`);
    return andResult;
}

module.exports = evaluateAnd;