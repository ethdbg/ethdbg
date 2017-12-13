/**
 * @author Sean Batzel
 * @author Andrew Plaza <aplaza@liquidthink.net>
 */ 
const Pino = require('pino');
const clc = require('cli-color');
const stream = require('stream');
const fs = require('fs');
const {isDef} = require('./utils')
const fatal = clc.redBright.bold.bgYellow;
const error = clc.red.bold;
const warn = clc.yellowBright;
const info = clc.whiteBright.bgBlack;
const trace = clc.blue.bold;
const debug = clc.blueBright;
const vmDebug = clc.magentaBright;

/**
 * private function to get level
 * default logger level is info
 * @private
 * @param{Number} n - level
 */
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

function getPinoLevel(n) {
  switch (n) {
    case 0:
      return 'SILENT';
    case 10:
      return trace('TRACE');
    case 20:
      return debug('DEBUG');
    case 25:
      return vmDebug('VMDebug');
    case 30:
      return info('INFO');
    case 40:
      return warn('WARN');
    case 50:
      return error('ERROR');
    case 60:
      return fatal('FATAL');
    default:
      return info('INFO');
  }
}

function getColor(n, msg) {
  switch (n) {
    case 0:
      return;
    case 10:
      return trace(msg);
    case 20:
      return debug(msg);
    case 25:
      return vmDebug(msg);
    case 30:
      return info(msg);
    case 40:
      return warn(msg);
    case 50:
      return error(msg);
    case 60:
      return fatal(msg);
    default:
      return info(msg);
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
 * @param {number|undefined|null} level - logger level
 * @param {string} logFile - file to write logs to
 * @private
 */
class Logger {
  constructor(level, file) {
    this.level = level;
    const logFile = isDef(file) ? file : './../logs/ethdbg.log';
    this.pino = Pino({
      name: 'Ethereum Debug Logger',
      level: getLvl(level),
    }, new stream.Writable({write: (chunk) => {
      const data = JSON.parse(chunk.toString());
      const logString =
        `[${new Date(data.time)}] (${data.name}/${data.pid} on` +
        ` ${data.hostname} ${getPinoLevel(data.level)}:` +
        ` ${getColor(data.level, data.msg)}` +
        '\n';
      fs.appendFile(logFile, logString, (e) => { if (e) console.error(e); });
      console.log(
      `${getPinoLevel(data.level)}: ${getColor(data.level, data.msg)}`);
    }}));
    this.pino.addLevel('vmDebug', 25); // add a level between 'info' and 'debug'
    this.pino.on('error', function(err) {
      console.error('Logger cannot flush on exit due to provided output stream');
      process.exit(1);
    });
  }

  /**
   * @author Andrew Plaza
   * @param {Object} obj to deserialize/trace
   * @param {string|undefined|null} msg
   */
  trace(obj, msg) {
    this.pino.trace(obj, msg);
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
    this.pino.vmDebug(message);
  }

  /**
   * @author Andrew
   * info message
   * @param{any}
   * @private
   */
  info(message) {
    this.pino.info(message);
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
    this.pino.error(new Error(message));
  }

  /**
   * Exits and kills process if called
   * @author Sean Batzel
   * @param {string} message - message that the log should print.
   * @private
   */
  fatal(message) {
    this.pino.fatal(message);
    process.exit(1);
  }
}

module.exports = Logger;
