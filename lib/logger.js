/**
 * @author Sean Batzel
 *
 * This allows messages during runtime to be displayed to the programmer
 * with various levels of detail. The higher the level, the more
 * information you receive during runtime.
 *
 * Log Levels
 * 1 - Only fatal errors.
 * 2 - Critical errors and higher.
 * 3 - General errors and all above.
 * 4 - Warnings and anything worse.
 * 5 - Everything you never wanted to know about the program is displayed.
 */
module.exports = class Logger {
  constructor(level) {
    this.level = level;
  }

  debug(message) {
    // Literally every tiny detail you might ever care about.
    if (this.level == 5) {
      console.log('DEBUG: ' + message);
    }
  }

  warn(message) {
    // Little things, not super worried.
    if (this.level == 4) {
      console.log('WARNING: ' + message);
    }
  }

  error(message) {
    // Internal errors, the world won't end.
    if (this.level == 3) {
      console.log('ERROR: ' + message);
    }
  }

  critical(message) {
    // This is important, but not fatal.
    if (this.level == 2) {
      console.log('CRITICAL: ' + message);
    }
  }

  die(message) {
    // If this happens, we ALWAYS display and halt.
    console.log('CRITICAL ERROR: ' + message + ' TERMINATING PROCESS.');
    process.exit(1);
  }
}
}
