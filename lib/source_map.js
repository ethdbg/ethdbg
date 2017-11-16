class SourceMap {
  /*
   * Source mappings end up in the following format:
   * 's:l:f:j;'
   *
   * s - source offset
   * l - section length
   * f - source index?
   * j - i if function, o if return, - if just jump
   *
   */

  constructor(source_code, byte_code) {
    // Match up the source code, byte code, and source map line by line.
  }

  current_line() {
    // Get the source code range the current set of instructions covers
    // Determine line number.
  }

  next_line() {
    // Get the source code range for the next line.
    // Determine the line number.
  }
}
