const levelInfoByLevelKey = {
  all: { value: Number.MIN_VALUE, colour: 'grey' },
  trace: { value: 5000, colour: 'blue' },
  debug: { value: 10000, colour: 'cyan' },
  info: { value: 20000, colour: 'green' },
  progress: { value: 25000, colour: 'black' },
  warn: { value: 30000, colour: 'yellow' },
  error: { value: 40000, colour: 'red' },
  fatal: { value: 50000, colour: 'magenta' },
  mark: { value: 9007199254740992, colour: 'grey' }, // 2^53
  off: { value: Number.MAX_VALUE, colour: 'grey' },
};


class ConsoleLogger {
  constructor({ category = '', level }) {
    this.category = category;
    this._levelValue = undefined;
    this._level = undefined;
    this.level = level;
    this.context = {};
    Object.keys(levelInfoByLevelKey).forEach((levelKey) => {
      this[levelKey] = (message) => {
        this.log(levelKey, message)
      };
    });
  }
  /**
     * Returns a logger with category `${currentLoggerCategory}.${subCategory}`
     * @param {String} subCategory - Name of the subCategory
     * @returns {ConsoleLogger}
     */
  getChildLogger(subCategory) {
    return new ConsoleLogger({
      category: `${this.category}.${subCategory}`,
      level: this._level,
    });
  }

  /**
     * Returns a logger that uses the same logging framework as the current one, with a new category.
     * Shortcut for contexts where you don't have the logging framework
     * Doesn't make sense here but kept to have same interface as other projects
     * @param {String} category - Category for the new logger
     * @param {String} level - Category for the new logger
     * @returns {ConsoleLogger}
     */
  getRootLogger(category, level) {
    return new ConsoleLogger({ category, level });
  }

  set level(newLevel) {
    const levelInfo = levelInfoByLevelKey[newLevel];
    if (!levelInfo) {
      throw new Error(`Unknown level ${newLevel}`);
    }
    this._level = newLevel;
    this._levelValue = levelInfo.value;
  }

  addContext(key, value) {
    this.context[key] = value;
  }

  log(level, message) {
    const levelInfo = levelInfoByLevelKey[level];
    if (!levelInfo) {
      throw new Error(`Unknown level ${level}`);
    }
    if (levelInfo.value < this._levelValue) return;
    console.log(`${this.category} - ${level}: ${typeof message === 'function' ? message() : message}`);
  }
}



module.exports = ConsoleLogger;

