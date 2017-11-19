const SourceMap = require('./source_map.js');
/**
 *@author Sean Batzel, Andrew Plaza
 * Debugger class: where the magic is abstracted, and the pain goes away
 */
class Debugger {

    constructor(source_code, byte_code) {
        this.breakpoints = new Array();
        this.source_map = SourceMap(source_code, byte_code);
    } 

    get_breakpoint(current_line) {
        // NOTE: We could probably clean this up by condensing it down.
        return (this.source_map.line_mapping_set[current_line].is_breakpoint ? true:false);
    }

    toggle_breakpoint(line_number) {
        this.source_map
          .line_mapping_set[line_number]
          .is_breakpoint = !(this.source_map
            .line_mapping_set[line_number]
            .is_breakpoint);
    }

    next_step() {
        let line = source_map.current_line();
        if (get_breakpoint(line) {
            // pause execution
        } else {
            source_map.next_line();
        }
    }
}
