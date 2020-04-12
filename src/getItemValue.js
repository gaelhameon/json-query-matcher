const log4js = require('@log4js-node/log4js-api');
const logger = log4js.getLogger('json-query-matcher.getItemValue');

const _ = require('lodash');

/**
 * Gets the value of field in item and returns it
 * @param {Object} item the object that contains the field
 * @param {string} field path to the field in the object
 * @returns {Any} the value of field in item. Undefined if not found.
 */
function getItemValue(item, field) {
  const value = _.get(item, field);
  logger.trace(`Got value ${value} in field ${field} of item ${JSON.stringify(item)}`);
  return value;
}

module.exports = getItemValue;