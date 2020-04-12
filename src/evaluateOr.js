const evaluateMatch = require('./evaluateMatch');

function evaluateOr(item, orQueries) {
    if (!Array.isArray(orQueries)) throw new Error(`Value of a $or key should be an array. Got ${typeof orQueries} ${orQueries}`);
    return orQueries.some(orQuery => {
        return evaluateMatch(item, orQuery);
    });
}

module.exports = evaluateOr;

