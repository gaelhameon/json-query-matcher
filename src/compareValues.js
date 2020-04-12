/**
 * Compares values
 * @param {Any} itemValue the value in the item
 * @param {Any} queryValue the value in the query
 * @param {('$eq'|'$ne'|'$gt'|'$gte'|'$lt'|'$lte')} operator comparison operator
 * @returns {Boolean} the result of the comparison
 */
function compareValues(itemValue, queryValue, operator = "$eq") {
    switch (operator) {
        case "$eq":
            return itemValue === queryValue;
        case "$ne":
            return itemValue !== queryValue;
        case "$gt":
            return itemValue > queryValue;
        case "$gte":
            return itemValue >= queryValue;
        case "$lte":
            return itemValue <= queryValue;
        case "$lt":
            return itemValue < queryValue;
        default:
            throw new Error(`Unknown operator ${operator}`);
    }
}

module.exports = compareValues;