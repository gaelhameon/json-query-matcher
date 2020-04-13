const recursiveEvaluateMatch = require('./src/recursiveEvaluateMatch');

/**
 * Evaluates object againts query and returns the result
 * @param {Object} item The item to evaluate againts the query
 * @param {Object} query The query
 * @returns {Boolean} True if the item matches the query, false otherwise
 */
function evaluateMatch(item, query) {
    return recursiveEvaluateMatch(item, query);
}

module.exports = {
    evaluateMatch
};