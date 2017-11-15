class Debugger {

    constructor(source_code, byte_code) {
        this.breakpoints = new Array();
        this.source_map = SourceMap(source_code, byte_code);
    } 

    get_breakpoint(current_line) {
        // NOTE: We could probably clean this up by condensing it down.
        return ((this.breakpoints.pop() == current_line) ? true:false);
    }

    set_breakpoint(line_number) {
        this.breakpoints.push(line_number);
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
