# json-query-matcher
Evaluates a mongodb-style query

## Why?

I'm working on an app in which I often have an array of objects in memory and I want to perform some operations on a subset of this array.

The criteria used to select this subset can vary greatly depending on the use case, and I want to let the users specify these criteria in a config file that will be loaded and evaluated at runtime.

An easy and flexible way would be to let the user write an Array.filter callback function and evaluate it at runtime, but that's not very safe.

I chose to have the user specify their criteria in a JSON object very strongly inspired by the syntax used to build queries in MongoDB: https://docs.mongodb.com/manual/tutorial/query-documents/

And now I'm writing this library to evaluate an object againts these criteria. (I assume MongoDB has one and it would be nice to reuse it, but I had a quick look at the codebase and couldn't find it and saw that it was mostly C++ and figured it would be fun to write this myself.)

## Installation
    npm install --save json-query-matcher

## Usage

```javascript
const { evaluateMatch } = require('json-query-matcher');

const items = [
    { firstName: "Gaël", lastName: "Haméon" },
    { firstName: "Gaël", lastName: "Monfils" },
    { firstName: "Alix", lastName: "Haméon" }
]

let query, result;

query = { "firstName": "Gaël" };
result = items.filter(item => evaluateMatch(item, query));
// expect(result).to.eql([{ firstName: "Gaël", lastName: "Haméon" }, { firstName: "Gaël", lastName: "Monfils" }]);

query = { "lastName": "Haméon" };
result = items.filter(item => evaluateMatch(item, query));
// expect(result).to.eql([{ firstName: "Gaël", lastName: "Haméon" }, { firstName: "Alix", lastName: "Haméon" }]);

query = { "firstName": "Gaël", "lastName": "Haméon" };
result = items.filter(item => evaluateMatch(item, query));
// expect(result).to.eql([{ firstName: "Gaël", lastName: "Haméon" }]);

query = { "$or": [{ "firstName": "Alix" }, { "lastName": "Monfils" }] };
result = items.filter(item => evaluateMatch(item, query));
// expect(result).to.eql([{ firstName: "Gaël", lastName: "Monfils" }, { firstName: "Alix", lastName: "Haméon" }]);

query = { "firstName": { "$ne": "Gaël" } };
result = items.filter(item => evaluateMatch(item, query));
// expect(result).to.eql([{ firstName: "Alix", lastName: "Haméon" }]);
```

## Features
TBC:
- Use lodash paths (not exactly the same notation as mongo) to access deep props of the items
