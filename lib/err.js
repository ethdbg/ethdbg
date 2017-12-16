/**
 * Ethereum Debug Error Handler
 * in addition to handling internal errors, it writes to the process' stdout,
 * for any processes which may be listening on it
 */
class EtherDebugError extends Error {
  constructor(message) {
    super(message);
    process.stdout.write(`message ${this}`);
  }
}
