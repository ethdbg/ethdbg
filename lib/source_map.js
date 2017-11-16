const fs = require('fs');

/**
 * @author Sean Batzel
 *
 * A struct class used for associating source code lines with
 * the corresponding instructions in the bytecode.
 */
class LineMapping {
  constructor(line_number, source_line, byte_line, breakpoint) {
    /**
     * TODO Find a way to associate bytes of source code with
     * lines of source code.
     */
    this.source_line = source_line;
    this.byte_line = byte_line;
    this.is_breakpoint = is_breakpoint;
    this.line_number = line_number;
  }
}

/**
 * @author Sean Batzel
 *
 * A class of functions for constructing the mapping of source
 * code to bytecode.
 */
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

  /**
   * @author Sean Batzel
   *
   * @param{source_code} file path to the source code
   * @param{byte_code} file path to the bytecode file
   * @param{source_map} file path to the source-to-byte map
   */
  constructor(source_code, byte_code, source_map) {
    // Match up the source code, byte code, and source map line by line.
    let source = fs.readFileSync(source_code);
    let byte_c = fs.readFileSync(byte_code);
    let mappin = fs.readFileSync(source_map);

    // This line should split the source map file in to an array of 
    // individual maps.
    // TODO Split the source code into lines.
    // TODO Split the bytecode by individual bytes.
    let source_map = mappin.split(";");
    this.line_mapping_set = new Array();
    for (let i = 0; i < bytes.length; i++) {
      let line_number = line_match(source, mappin[i]);
      let line = source[line_number];
      let byte_line = bytes[i];
      this.line_mapping_set(LineMapping(line_number, line, byte_line, false));
    }
  }

  /**
   * @author Sean Batzel
   *
   * Given the byte range (source_map[1..2]), determine the line we're in.
   * Referenced by the line_match function in order to pull line numbers
   * out of the given range of bytes of source code.
   *
   * @param{source} the set of all lines of source
   * @param{map) a single entry in the set of source mappings.
   */
  line_by_byte(source, map) {
  
  }

  /**
   * @author Sean Batzel
   * Return the set of the source line and starting/ending bytecode range.
   * This is the only use of the line_by_byte function.
   * @param{source_map} a particular source mapping set.
   */
  line_match(source_code, source_map) {
    let initial = source_map.split(":"); // produces the set { beginning, length, index, jump}
    // Based on initial[0], determine the line we're worried about
  }

  /**
   * This should return the LineMapping object so that we can easily pull source code, line numbers,
   * presence of a breakpoint, et cetera.
   */
  current_line() {
    // Get the source code range the current set of instructions covers
    // Determine line number.
  }

  /**
   * This will essentially be the same thing as current_line, only we want a way to pull the next
   * line without having to fiddle with indexing of LineMapping objects.
   */
  next_line() {
    // Get the source code range for the next line.
    // Determine the line number.
  }
}
