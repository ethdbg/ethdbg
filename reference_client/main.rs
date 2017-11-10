use std::env;

fn main() {
    let args: Vec<_> = env::args().collect();
    if args.len() == 3 {
        let src = args[1];
        let byt = args[2];
        // Call the library and enter the debugger.
    } else {
        println!("Usage: ethdbg source_file compiled_file");
    }
}
