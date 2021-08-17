const recursiveEvaluateMatch = require('./src/recursiveEvaluateMatch');
const ConsoleLogger = require('./src/logger/ConsoleLogger');

/**
 * Evaluates object against query and returns the result
 * @param {Object} item The item to evaluate against the query
 * @param {Object} query The query
 * @param {Object} rootLogger a logger
 * @returns {Boolean} True if the item matches the query, false otherwise
 */
function evaluateMatch(item, query, rootLogger) {
    const logger = rootLogger ?? new ConsoleLogger({category: 'json-query-matcher', level: 'off'})
    return recursiveEvaluateMatch(item, query, logger);
}

module.exports = {
    evaluateMatch
};