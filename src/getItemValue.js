const _ = require('lodash');

/**
 * Gets the value of field in item and returns it
 * @param {Object} item the object that contains the field
 * @param {string} field path to the field in the object
 * @returns {Any} the value of field in item. Undefined if not found.
 */
function getItemValue(item, field) {
  return _.get(item, field);
}

module.exports = getItemValue;