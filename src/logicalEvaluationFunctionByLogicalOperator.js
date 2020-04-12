const evaluateOr = require('./logicalEvaluationFunctions/evaluateOr');
const evaluateAnd = require('./logicalEvaluationFunctions/evaluateAnd');
const evaluateNot = require('./logicalEvaluationFunctions/evaluateNot');
const evaluateNor = require('./logicalEvaluationFunctions/evaluateNor');

module.exports = {
  $or: evaluateOr,
  $and: evaluateAnd,
  $not: evaluateNot,
  $nor: evaluateNor,
};