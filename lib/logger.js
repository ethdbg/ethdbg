class Logger {
  constructor(level) {
    this.level = level;
  }

  warn(message) {
    // Little things, not super worried.
    if (this.level == 4) console.log('WARNING: ' + message);
  }

  error(message) {
    // Internal errors, the world won't end.
    if (this.level == 3) console.log('ERROR: ' + message);
  }

  critical(message) {
    // This is important, but not fatal.
    if (this.level == 2) console.log('CRITICAL: ' + message);
  }

  die(message) {
    // If this happens, we ALWAYS display and halt.
    console.log('CRITICAL ERROR: ' + message + ' TERMINATING PROCESS.');
    process.exit(1);
  }
}
