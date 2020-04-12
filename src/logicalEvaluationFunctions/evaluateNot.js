const log4js = require('@log4js-node/log4js-api');
const logger = log4js.getLogger('json-query-matcher.evaluateNot');

const evaluateMatch = require('../recursiveEvaluateMatch');

function evaluateNot(item, query) {
    logger.trace(`item: ${JSON.stringify(item)}`);
    logger.trace(`query: ${JSON.stringify(query)}`);
    return !evaluateMatch(item, query);
}

module.exports = evaluateNot;