// const fs = require('fs');
const solc = require('solc');

/**
 * @author Sean Batzel
 *
 * A struct class used for associating source code lines with
 * the corresponding instructions in the bytecode.
 */
class LineMapping {
  /**
   * @author{Sean Batzel}
   * @param{Integer} lineNumber
   * @param{Integer} sourceLine
   * @param{Integer} byteLine
   * @param{bool} isBreakpoint
   */
  constructor(lineNumber, sourceLine, byteLine, isBreakpoint) {
    /**
     * TODO figure out some way to keep track of jumps...
     */
    this.source_line = sourceLine;
    this.byte_line = byteLine;
    this.is_breakpoint = isBreakpoint;
    this.line_number = lineNumber;
  }
}

/**
 * @author Sean Batzel
 *
 * A class of functions for constructing the mapping of source
 * code to bytecode.
 */
class BytecodeSourceMap {
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
   * @author Andrew Plaza
   *
   * @param{string} sourceCode source code in utf8
   * @param{string} contractName name of contract to debug
   */
  constructor(sourceCode, contractName) {
    // Match up the source code, byte code, and source map line by line.
    this.source = sourceCode;
    this.compiled_source = solc.compile(sourceCode, 1);
    this.byte_c = this.compiled_source.contracts[`:${contractName}`].bytecode;
    // / the mapping from bytecode to sourcecode
    this.srcmap_bin = this.compiled_source
                          .contracts[`:${contractName}`].srcmapRuntime;

    // This line should split the source map file in to an array of
    // individual maps.
    // let sourceStrings = this.source.split('\n');
    let byteSet = this.byte_c.split('');
    // let sourceMaps = this.srcmap_bin.split(';');
    this.line_mapping_set = [];
    for (let i = 0; i < byteSet.length; i++) {
      // TODO: line_match expects beginning and end of range:w
      let lineNumber = this.line_match(this.srcmap_bin[i]);
      let line = this.source[lineNumber];
      let byteLine = byteSet[i];
      this.line_mapping_set[new LineMapping(lineNumber, line, byteLine, false)];
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
   * number, Bob's your uncle, get out of this function.
   *
   * @param{Array} source: the set of all lines of source
   * @param{Integer} map0: the beginning of a source code byte range.
   * @param{Integer} map1: the end of a source code range.
   * @return{Integer} line number
   */
  lineByByte(source, map0, map1) {
    let sum = 0;
    for (let i = 0; i < source.length; i++) {
      if ((sum + source[i].length) > map0) {
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
   * @param{Array} sourceMap a particular source mapping set.
   * @return{Integer}
   */
  lineMatch(sourceMap) {
    // produces the set { beginning, length, index, jump}
    let initial = sourceMap.split(':');
    // Based on initial[0], determine the line we're worried about
    let lineNumber = this.lineByByte(sourceMap, initial[0], initial[1]);
    return lineNumber;
  }

  /**
   * @author Sean Batzel, Andrew Plaza
   * @return{Integer}
   * This should return the LineMapping object so that we can easily
   * pull source code, line numbers, presence of a breakpoint, et cetera.
   */
  currentLine() {
    return this.line_mapping_set.pop();
  }

  /**
   * @author Sean Batzel, Andrew Plaza
   * @return{Integer}
   * This will essentially be the same thing as current_line
   * only we want a way to pull the next having to fiddle
   * with indexing of LineMapping objects.
   */
  nextLine() {
    // Get the source code range for the next line.
    // Determine the line number.
    return this.line_mapping_set.pop();
  }
}

module.exports = BytecodeSourceMap;
