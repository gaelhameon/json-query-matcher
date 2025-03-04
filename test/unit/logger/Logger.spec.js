const { expect } = require('chai');

const Logger = require('../../../src/logger/ConsoleLogger');

describe('Logger.getRootLogger', () => {
  it(`returns a new logger with a different base category`, () => {
    const baseLogger = new Logger({level: 'trace', category: 'A'});
    const newLogger = baseLogger.getRootLogger('B', 'trace');
    expect(newLogger).to.be.instanceOf(Logger);
    expect(newLogger.category).to.equal('B');
  });
});

describe('Logger.addContext', () => {
  it(`returns a new logger with a different base category`, () => {
    const baseLogger = new Logger({level: 'trace', category: 'A'});
    baseLogger.addContext('serviceName', 'testService');
    expect(baseLogger.context).to.eql({serviceName:'testService'});
  });
});

describe('Logger level errors', () => {
  it(`throws when trying to set a level that does not exist`, () => {
    expect(
      () => {
        const baseLogger = new Logger({level: 'badLevel', category: 'A'});
      }
    ).to.throw((`Unknown level "badLevel"`))
  });

  it(`throws when trying to log at a level that does not exist`, () => {
    expect(
      () => {
        const baseLogger = new Logger({level: 'trace', category: 'A'});
        baseLogger.log('badLevel', 'test message')
      }
    ).to.throw((`Unknown level "badLevel"`))
  });
});