const log4js = require('@log4js-node/log4js-api');
const logger = log4js.getLogger('json-query-matcher.evaluateOr');

const evaluateMatch = require('../recursiveEvaluateMatch');

function evaluateNor(item, norQueries) {
    logger.trace(`item: ${JSON.stringify(item)}`);
    logger.trace(`norQueries: ${JSON.stringify(norQueries)}`);
    if (!Array.isArray(norQueries)) throw new Error(`Value of a $nor key should be an array. Got ${typeof norQueries} ${norQueries}`);
    const norResult = norQueries.every(norSubQuery => {
        const subResult = evaluateMatch(item, norSubQuery);
        logger.trace(`result is ${subResult} for norSubQuery ${JSON.stringify(norSubQuery)} on item ${JSON.stringify(item)}`);
        return !subResult;
    });
    logger.debug(`result is ${norResult} for norQueries ${JSON.stringify(norQueries)} on item ${JSON.stringify(item)}`);
    return norResult;
}

module.exports = evaluateNor;