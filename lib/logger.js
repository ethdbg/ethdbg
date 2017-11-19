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

  debug(message) {
    // Literally every tiny detail you might ever care about.
    if (this.level >= 5) {
      console.log(debug('DEBUG: '), message);
    }
  }

  warn(message) {
    // Little things, not super worried.
    if (this.level >= 4 ) {
      console.log(warn('WARNING: '), message);
    }
  }

  error(message) {
    // Internal errors, the world won't end.
    if (this.level >= 3) {
      console.log(error('ERROR: '), message);
    }
  }

  critical(message) {
    // This is important, but not fatal.
    if (this.level >= 2) {
      console.log(critical('CRITICAL: '), message);
    }
  }

  die(message) {
    // If this happens, we ALWAYS display and halt.
    if (this.level >= 1 ) {
      console.log(die('CRITICAL ERROR: '), message);
      console.log(die('TERMINATING PROCESS'));
      process.exit(1);
    }
  }
}
module.exports = Logger;
