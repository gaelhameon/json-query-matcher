const compareValues = require('./comparisonFunctions/compareValues');
const evaluateInOrNin = require('./comparisonFunctions/evaluateInOrNin');

module.exports = {
  $eq: compareValues,
  $ne: compareValues,
  $gt: compareValues,
  $gte: compareValues,
  $lt: compareValues,
  $lte: compareValues,
  $in: evaluateInOrNin,
  $nin: evaluateInOrNin,
};