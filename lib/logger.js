/** @author Sean Batzel
 * @author Andrew Plaza <aplaza@liquidthink.net>
 */
const clc = require('cli-color');

const die = clc.redBright.bold.blink.bgYellow;
const critical = clc.redBright.bold;
const error = clc.red.bold;
const warn = clc.yellowBright;
const debug = clc.blueBright;


/**
 *
 * This allows messages during runtime to be displayed to the programmer
 * with various levels of detail. The higher the level, the more
 * information you receive during runtime.
 *
 * Log Levels
 * 5 - Everything you never wanted to know about the program is displayed.
 * 4 - Warnings and anything worse.
 * 3 - General errors and all below.
 * 2 - critical errors and higher.
 * 1 - Only fatal errors.
 */
class Logger {
  /**
   * @param{number} level - logger level.
   */
  constructor(level) {
    this.level = level;
  }

  /**
   * @author Sean Batzel
   * @param{string} message that the log should print.
   */
  debug(message) {
    // Literally every tiny detail you might ever care about.
    if (this.level >= 5) {
      console.log(debug('DEBUG: '), message);
    }
  }

  /**
   * @author Sean Batzel
   * @param{string} message that the log should print.
   */
  warn(message) {
    // Little things, not super worried.
    if (this.level >= 4) {
      console.log(warn('WARNING: '), message);
    }
  }

  /**
   * @author Sean Batzel
   * @param{string} message that the log should print.
   */
  error(message) {
    // Internal errors, the world won't end.
    if (this.level >= 3) {
      console.log(error('ERROR: '), message);
    }
  }

  /**
   * @author Sean Batzel
   * @param{string} message that the log should print.
   */
  critical(message) {
    // This is important, but not fatal.
    if (this.level >= 2) {
      console.log(critical('CRITICAL: '), message);
    }
  }

  /**
   * @author Sean Batzel
   * @param{string} message that the log should print.
   */
  die(message) {
    // If this happens, we ALWAYS display and halt.
    if (this.level >= 1) {
      // Changed this because calling die() recursively causes the process to
      // terminate before we're finished printing logging calls. The coloring
      // will end up being off, but it'll work.
      console.log(critical('CRITICAL ERROR: '), message);
      console.log(critical('TERMINATING PROCESS'));
      process.exit(1);
    }
  }
}
module.exports = Logger;
