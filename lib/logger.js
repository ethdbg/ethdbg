/**
 * @author Sean Batzel
 * @author Andrew Plaza <aplaza@liquidthink.net>
 */
const clc = require('cli-color');
const {
  isDef,
  serialize
} = require('./utils');
// const die = clc.redBright.bold.blink.bgYellow;
const critical = clc.redBright.bold;
const error = clc.red.bold;
const warn = clc.yellowBright;
const debug = clc.blueBright;
const vmDebug = clc.magentaBright;
const info = clc.cyanBright;

/**
 * A simple Logger class
 * This allows messages during runtime to be displayed to the programmer
 * with various levels of detail. The higher the level, the more
 * information you receive during runtime.
 * `providerMode` outputs to stdout with ethdbg-style serialized messages
 *
 * Log Levels
 * 6 - Everything you never wanted to know about the program is displayed.
 * 5 - Info and all below
 * 4 - Warnings and anything worse.
 * 3 - General errors and all below.
 * 2 - critical errors and higher.
 * 1 - Only fatal errors.
 * @author Sean Batzel
 * @param {number} level - logger level
 * @private
 */
class Logger {
  constructor(level, providerMode) { // eslint-disable-line require-jsdoc
    this.level = isDef(level) ? level : 5;
    this.providerMode = isDef(providerMode) ? providerMode : false;
  }

  /**
   * @author Sean Batzel
   * @param {string} message - a message that the log should print.
   * @private
   */
  debug(message) {
    // Literally every tiny detail you might ever care about.
    if (this.level >= 6 && !this.providerMode) {
      console.log(debug('DEBUG: '), message); // eslint-disable-line no-console
    } else if (this.level >= 6 && this.providerMode) {
      process.stdout.write(serialize('message', debug('DEBUG: ') + message));
      process.stdout.write('\n');
    }
  }

  /**
   * @author Andrew Plaza
   * debug messages specific to the VM
   * @param {string} message - message the log should print
   * @private
   */
  vmDebug(message) {
    // debug messages from the VM specific to ETHDBG
    if (this.level >= 6 && !this.providerMode) {
      // eslint-disable-next-line no-console
      console.log(vmDebug('VMDebug: '), message);
    } else if (this.level >= 6 && this.providerMode) {
      process.stdout.write(serialize('message', vmDebug('VMDebug: ') + message));
      process.stdout.write('\n');
    }
  }

  /**
   * @author Andrew Plaza
   * messages useful to the end user
   * @param{string} message - message the log should print
   * @private
   */
  info(message) {
    if (this.level >= 5 && !this.providerMode) {
      console.log(info('INFO: '), message); // eslint-disable-line no-console
    } else if (this.level >= 5 && this.providerMode) {
      process.stdout.write(serialize('message', info('INFO: ') + message));
      process.stdout.write('\n');
    }
  }

  /**
   * @author Sean Batzel
   * @param {string} message - message that the log should print.
   * @private
   */
  warn(message) {
    // Little things, not super worried.
    if (this.level >= 4 && !this.providerMode) {
      console.log(warn('WARNING: '), message); // eslint-disable-line no-console
    } else if (this.level >= 4 && this.providerMode) {
      process.stdout.write(serialize('message', warn('WARNING: ') + message));
      process.stdout.write('\n');
    }
  }

  /**
   * @author Sean Batzel
   * @param {string} message - message that the log should print.
   * @private
   */
  error(message) {
    // Internal errors, the world won't end.
    if (this.level >= 3 && !this.providerMode) {
      console.log(error('ERROR: '), message); // eslint-disable-line no-console
    } else if (this.level >= 3 && this.providerMode) {
      process.stdout.write(serialize('message', error('ERROR: ') + message));
      process.stdout.write('\n');
    }
  }

  /**
   * @author Sean Batzel
   * @param {string} message - a message that the log should print.
   * @private
   */
  critical(message) {
    // This is important, but not fatal.
    if (this.level >= 2 && !this.providerMode) {
      // eslint-disable-next-line no-console
      console.log(critical('CRITICAL: '), message);
    } else if (this.level >= 2 && this.providerMode) {
      process.stdout.write(
        serialize('message', critical('CRITICAL: ') + message)
      );
      process.stdout.write('\n');
    }
  }

  /**
   * Exits and kills process if called
   * @author Sean Batzel
   * @param {string} message - message that the log should print.
   * @private
   */
  die(message) {
    // If this happens, we ALWAYS display and halt.
    if (this.level >= 1 && !this.providerMode) {
      // Changed this because calling die() recursively causes the process to
      // terminate before we're finished printing logging calls. The coloring
      // will end up being off, but it'll work.

      /* eslint-disable no-console */
      console.log(critical('CRITICAL ERROR: '), message);
      console.log(critical('TERMINATING PROCESS'));
      process.exit(1);
      /* eslint-enable no-console */
    } else if (this.level >= 1 && this.providerMode) {
      process.stdout.write(
        serialize('message', critical('CRITICAL ERROR: ') + message)
      );
      process.stdout.write('\n');
      process.stdout.write(
        serialize('message', critical('TERMINATING DEBUG PROVIDER'))
      );
      process.stdout.write('\n');
      process.exit(1);
    }
  }
}

module.exports = Logger;
