extern crate web3;
extern crate rustc_hex;

mod contract;

#[cfg(test)]
// Test Convention
// test_<Struct Name>_<Fn Name>
mod tests {
    use ::contract::DebugContract;
    use web3::api::Eth;
    use web3::transports::http::Http;
    use web3::helpers::CallResult;
    use web3::futures::Future;
    use web3;
    use std::process;

    #[test]
    fn it_works() {
        println!("It works!");
    }
    #[test]
    fn test_contract_deploy() {
        let ( _eloop, http ) = web3::transports::Http::new("http://localhost:8545")
            .unwrap();
        let web3 = web3::Web3::new(http);
        
        println!("Coinbase Addr: {:?}", web3.eth().coinbase().wait().unwrap());
        let debug_contract = DebugContract::new(
            web3.eth().coinbase().wait().unwrap(),
            None, 
            "http://localhost:8545".to_string()
        );
        debug_contract.deploy();
    }
}

