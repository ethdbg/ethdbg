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
     * TODO figure out some way to keep track of jumps...
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
    let source_strings = source.split("\n");
    let byte_set = byte_c.split('');
    let source_maps = mappin.split(";");
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
   * NOTE: If I'm thinking correctly, this should return the line number
   * we want. 
   *
   * WRITTEN RUBBER DUCK READY HERE WE GO:
   * The sum is the current length of the source code in bytes. We iterate
   * over the entire set of lines of source code, and if the initial byte
   * isn't in that line (i.e. the length of the source code we've checked
   * isn't longer than the byte we're looking for) we just add to the sum
   * and keep going. Otherwise, we're there! Good going! Return the line
   * number, bob's your uncle, get out of this function.
   *
   * @param{source} the set of all lines of source
   * @param{map_0} the beginning of a source code byte range.
   * @param{map_1} the end of a source code range.
   */
  line_by_byte(source, map_0, map_1) { 
    let sum = 0;
    for (let i = 0; i < source.length; i++) {
      if ((sum + source[i].length) > map_0) {
        return i;
      } else {
        sum = sum + source[i].length;
      }
    }
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
    let line_number = line_by_byte(source_code, initial[0], initial[1]);
    return line_number;
  }

  /**
   * This should return the LineMapping object so that we can easily pull source code, line numbers,
   * presence of a breakpoint, et cetera.
   */
  current_line() {
    // Get the source code range the current set of instructions covers
    // Determine line number.
    return line_mapping_set.pop();
  }

  /**
   * This will essentially be the same thing as current_line, only we want a way to pull the next
   * line without having to fiddle with indexing of LineMapping objects.
   */
  next_line() {
    // Get the source code range for the next line.
    // Determine the line number.
    return line_mapping_set.pop();
  }
}
