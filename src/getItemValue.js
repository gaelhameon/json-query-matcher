const { inspect } = require('util');

const _ = require('lodash');

/**
 * Gets the value of field in item and returns it
 * @param {Object} item the object that contains the field
 * @param {string} field path to the field in the object
 * @returns {Any} the value of field in item. Undefined if not found.
 */
function getItemValue(item, field, parentLogger) {
  const logger = parentLogger.getChildLogger('getItemValue');
  const value = _.get(item, field);
  logger.trace(() => `Got value ${inspect(value)} in field ${field} of item ${inspect(item)}`);
  return value;
}

module.exports = getItemValue;