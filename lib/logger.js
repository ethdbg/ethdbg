/**
 * @author Sean Batzel
 * @author Andrew Plaza <aplaza@liquidthink.net>
 */ 
const Pino = require('pino');
const clc = require('cli-color');
// const die = clc.redBright.bold.blink.bgYellow;
const critical = clc.redBright.bold;
const error = clc.red.bold;
const warn = clc.yellowBright;
const debug = clc.blueBright;
const vmDebug = clc.magentaBright;

function getLvl (n) {
  switch (n) {
    case 6:
      return 'trace';
    case 5:
      return 'debug';
    case 4:
      return 'info';
    case 3:
      return 'warn';
    case 2:
      return 'error';
    case 1:
      return 'fatal';
    case 0:
      return 'silent';
    default:
      return 'info';
  }
}
/**
 *
 * This allows messages during runtime to be displayed to the programmer
 * with various levels of detail. The higher the level, the more
 * information you receive during runtime.
 *
 * Log Levels
 * 5 - Everything you never wanted to know about the program is displayed.
 * 4 - Info: general information about the program useful to end-user
 * 3 - Warnings and anything worse.
 * 2 - General errors and all below.
 * 1 - Only fatal errors.
 * @author Sean Batzel
 * @param {number} level - logger level
 * @private
 */
class Logger {
  constructor(level) {
    this.level = level;
    this.pino = Pino({
      name: 'Ethereum Debug Logger',
      level: getLvl(level),
      prettyPrint: true,
    });
    this.pino.addLevel('vmDebug', 45);
    this.console = console;
  }

  /**
   * @author Sean Batzel
   * @param {string} message - a message that the log should print.
   * @private
   */
  debug(message) {
    // Literally every tiny detail you might ever care about.
    this.pino.debug(message);
  }

  /**
   * @author Andrew Plaza
   * debug messages specific to the VM
   * @param {string} message - message the log should print
   * @private
   */
  vmDebug(message) {
    //debug messages from the VM specific to ETHDBG
    this.pino.vmDebug(vmDebug('VMDebug: '), message);
  }

  /**
   * @author Sean Batzel
   * @param {string} message - message that the log should print.
   * @private
   */
  warn(message) {
    // Little things, not super worried.
    this.pino.warn(warn(message));
  }

  /**
   * @author Sean Batzel
   * @param {string} message - message that the log should print.
   * @private
   */
  error(message) {
    // Internal errors, the world won't end.
    if (this.level >= 3) {
      this.pino.error(new Error(message));
    }
  }

  /**
   * @author Sean Batzel
   * @param {string} message - a message that the log should print.
   * @private
   */
  critical(message) {
    // This is important, but not fatal.
    if (this.level >= 2) {
      this.pino.error(critical('CRITICAL: '), message);
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
    // Changed this because calling die() recursively causes the process to
    // terminate before we're finished printing logging calls. The coloring
    // will end up being off, but it'll work.
    this.pino.fatal(message);
    this.console.log(critical('TERMINATING PROCESS'));
    process.exit(1);
  }
}

module.exports = Logger;
