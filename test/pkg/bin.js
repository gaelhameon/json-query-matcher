const { evaluateMatch } = require('../../index');

const items = [
  { firstName: "Gaël", lastName: "Haméon" },
  { firstName: "Gaël", lastName: "Monfils" },
  { firstName: "Alix", lastName: "Haméon" }
]

const query = { "$or": [{ "firstName": "Alix" }, { "lastName": { $ne: "Haméon" } }] };
const result = items.filter(item => evaluateMatch(item, query));

console.log(JSON.stringify(result));
