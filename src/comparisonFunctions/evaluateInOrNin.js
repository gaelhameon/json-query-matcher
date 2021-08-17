const compareValues = require('./compareValues');

/**
 * Compares values using $in or $nin
 * @param {Any} itemValue the value in the item
 * @param {Any[]} queryValues the array of values in the query
 * @param {('$in'|'$nin)} operator comparison operator
 * @returns {Boolean} the result of the comparison
 */
function evaluateInOrNin(itemValue, queryValues, operator, parentLogger) {
    const logger = parentLogger.getChildLogger('evaluateInOrNin');

    logger.trace(`Comparing itemValue ${itemValue} with queryValue ${queryValues} using ${operator}`);
    if (!Array.isArray(queryValues)) throw new Error(`The value associated with the ${operator} operator must be an array. Got ${typeof queryValues} ${queryValues}`);
    switch (operator) {
        case "$in":
            return queryValues.some(queryValue => compareValues(itemValue, queryValue, "$eq", parentLogger));
        case "$nin":
            return queryValues.every(queryValue => compareValues(itemValue, queryValue, "$ne", parentLogger));
        default:
            throw new Error(`Unknown operator ${operator}`);
    }
}

module.exports = evaluateInOrNin;