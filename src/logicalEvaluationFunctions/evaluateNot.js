const log4js = require('@log4js-node/log4js-api');
const logger = log4js.getLogger('json-query-matcher.evaluateNot');
const { inspect } = require('util');

const evaluateMatch = require('../recursiveEvaluateMatch');

function evaluateNot(item, query) {
    logger.trace(() => `item: ${inspect(item)}`);
    logger.trace(() => `query: ${inspect(query)}`);
    return !evaluateMatch(item, query);
}

module.exports = evaluateNot;