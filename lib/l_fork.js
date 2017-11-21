const Fork = require('./forkc.js');
const Logger = require('./logger.js');

let logger = new Logger(5);
let fork = new Fork({}, logger);
fork.init();
