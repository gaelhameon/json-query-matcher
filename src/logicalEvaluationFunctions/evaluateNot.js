const { inspect } = require('util');

const evaluateMatch = require('../recursiveEvaluateMatch');

function evaluateNot(item, query, parentLogger) {
    const logger = parentLogger.getChildLogger('evaluateNot');
    logger.trace(() => `item: ${inspect(item)}`);
    logger.trace(() => `query: ${inspect(query)}`);
    return !evaluateMatch(item, query, parentLogger);
}

module.exports = evaluateNot;