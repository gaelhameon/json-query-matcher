const _ = require('lodash');

function evaluateField(item, field, queryValue, operator = "$eq") {
    const itemValue = _.get(item, field);
    switch (operator) {
        case "$eq":
            return itemValue === queryValue;
        case "$ne":
            return itemValue !== queryValue
        default:
            throw new Error(`Unknown operator ${operator}`);
    }
}

module.exports = evaluateField;