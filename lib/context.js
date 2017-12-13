"use strict";

/**
 * Context object providing access between elements of the debugger to
 * internal program information.
 * @author Sean Batzel
 * @param {string} line - current line of code
 * @param {Object} variables - dictionary of variables currently in scope
 * @param {boolean} exception - are we stopped because of an exception?
 * @param {Array} errInfo - any information that we'd need if an exception did occur
 * @param {Array} stack - current stack trace
 * @public
 */
class Context {
  constructor(line, variables, exception, errInfo, stack) {
    this.line = line;
    this.variables = variables;
    this.exception = exception;
    this.errInfo = errInfo;
    this.stack = stack;
  }

  /**
   * Adds a variable to the internal array of variables.
   * @author Sean Batzel
   * @param {string} name - variable name.
   * @param {number} value - variable value.
   * @public
   */
  addVariable(name, value) {
    this.variables.push(
      {
        'name': name,
        'value': value,
      }
    )
  }

  /**
   * Adds a stackframe to the internal stack trace array.
   * @author Sean Batzel
   * @param {string} text - content of the stackframe.
   * @param {string} file - filepath the frame occurred at.
   * @param {number} line - line number the frame occurred at.
   * @public
   */
  addStacktrace(text, file, line) {
    this.stack.push(
      {
        'text': text,
        'file': file,
        'line': line,
      }
    );
  }
}

module.export = Context;
exports.Context = Context;