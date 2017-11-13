use web3::futures::Future;
use web3::contract::{Contract, Options};
use web3::types::{Address, U256};
use web3::Transport;
use web3::transports::http::Http;
use web3;
use rustc_hex::FromHex;

struct DebugContract {
    acc_addr: Address,
    contract_addr: Option<Address>,
    web3: web3::Web3<Http>,
    data: Vec<u8>,
}

/**
 * provides utility functions for deploying and testing Contracts on the testRPC
 *
 */
impl DebugContract {
    /**
     * Initializes new Contract to debug
     * acc_address: Your account address, hex
     */
    fn new(acc_addr: String, contract_addr: Option<String>, provider: String, contract_path: String) 
    -> DebugContract 
    {
        let ( _eloop, http ) = web3::transports::Http::new(&provider).unwrap();
        let web3 = web3::Web3::new(http);

        let acc_addr: Address = acc_addr.parse().unwrap();
        let bytecode: Vec<u8> = include_str!("./Greeter.sol").from_hex().unwrap();

        let c_addr;
        if let Some(addr) = contract_addr {
            c_addr = addr;
        } else { c_addr = None }

        DebugContract {
            acc_addr,
            contract_addr: c_addr,
            web3,
            data: bytecode,
        }
    }

    /// Deploys a contract to the testRPC
    pub fn deploy() {
    
    }

    /// Sends a test transaction to the testRPC
    pub fn test() {
    
    }
}
