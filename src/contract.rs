use web3::futures::Future;
use web3::contract::{Contract, Options};
use web3::types::{Address, U256};
use rustc_hex::FromHex;

struct DebugContract {
    address: Address,
    web3: web3::api::Web3,
    data: Vec<u8>,
}

impl DebugContract {
    
    fn new(address: String, provider: String, contract_path: String) -> Contract {
        let ( _eloop, http ) = web3::transports::Http::new(&provider).unwrap();
        let web3 = web3::Web3::new(http);

        let my_account: Address = "0x00a329c0648769a73afac7f9381e08fb43dbea72".parse().unwrap();
        let bytecode: Vec<u8> = include_str!("./Greeter.sol").from_hex().unwrap();

        DebugContract {
            address,
            web3,
            data: bytecode,
        }
    }
    
    pub fn deploy() {
    
    }

    pub fn test() {
    
    }
}
