# json-query-matcher
Evaluates a mongodb-style query

## Why?

I'm working on an app in which I often have arrays of objects in memory and I want to perform some operations on a subset of these arrays.

The criteria used to select these subsets can vary greatly depending on the use cases, and I want to let the users specify these criteria in a config file that will be loaded and evaluated at runtime.

I chose to have the users specify their criteria in a JSON object very strongly inspired by the syntax used to build queries in MongoDB: https://docs.mongodb.com/manual/tutorial/query-documents/

And now I'm writing this library to evaluate an object against these criteria.

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
### Operators

#### Comparison operators
These 8 comparison operators are available and are meant to behave the [same way as in MongoDB](https://docs.mongodb.com/manual/reference/operator/query-comparison/)
  - `$eq`: equal
  - `$ne`: not equal
  - `$gt`: greater than
  - `$gte`: greater than or equal
  - `$lt`: less than
  - `$lte`: less than or equal
  - `$in`: in
  - `$nin`: not in

#### Logical operators
These 4 logical operators are available and are meant to behave the [same way as in MongoDB](https://docs.mongodb.com/manual/reference/operator/query-logical/)
- `$or`
- `$and` 
- `$nor` 
- `$not` 

#### Other operators
I plan on adding operators as I need them. Up next are probably the [array operators](https://docs.mongodb.com/manual/reference/operator/query-array/)

### Dot notation
[Like in MongoDB](https://docs.mongodb.com/manual/core/document/#dot-notation), you can use the dot notation to access deeper properties in an object.

If we have the object below:

```json
{
    "trip": {
        "trpNumber": "123456",
        "trpType": "1",
        "tripPoints": [
            {
                "trpptPlace": {
                    "code": "CJV",
                    "name": "Cergy-le-Haut"
                },
                "trpptArrivalTime": "09:35:15",
                "trpptDepartureTime": "09:35:50"
            },
            {
                "trpptPlace": {
                    "code": "CJP",
                    "name": "Cergy-Préfecture"
                },
                "trpptArrivalTime": "09:40:00",
                "trpptDepartureTime": "09:40:50"
            }
        ]
    },
    "block": {}
}

```
You can write `trip.tripPoints.1.trpptPlace.name` to get to "Cergy-Préfecture".