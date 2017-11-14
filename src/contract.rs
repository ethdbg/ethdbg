use web3::futures::Future;
use web3::contract::{Contract, Options};
use web3::types::{Address, U256};
use web3::Transport;
use web3::transports::http::Http;
use web3;
use rustc_hex::FromHex;

pub struct DebugContract {
    pub acc_addr: Address,
    pub contract_addr: Option<Address>,
    web3: web3::Web3<Http>,
    data: Vec<u8>,
    pub contract: Option<Contract<Http>>,
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
    #[allow(dead_code)]
    pub fn new(acc_addr: Address, contract_addr: Option<String>, provider: String) 
    -> DebugContract 
    {
        let ( _eloop, http ) = web3::transports::Http::new(&provider).unwrap();
        let web3 = web3::Web3::new(http);
        let bytecode: Vec<u8> = include_str!("./contract.code").from_hex().unwrap();
        let c_addr;
        if let Some(addr) = contract_addr {
            c_addr = Some(addr.parse().unwrap());
        } else { c_addr = None }

        DebugContract {
            acc_addr,
            contract_addr: c_addr,
            web3,
            data: bytecode,
            contract: None,
        }
    }

    /// Deploys a contract to the testRPC
    pub fn deploy(mut self) {
       self.contract = Some(Contract::deploy(self.web3.eth(), include_bytes!("./contract.abi")).unwrap()
           .confirmations(4)
           .options(Options::with(|mut opt| opt.gas = Some(5_000_000.into())))
           .execute(self.data, (
                U256::from(1_000_000),
                "Debug".to_owned(),
                3u64,
                "D".to_owned()
                ), self.acc_addr)
           .expect("Correct parameters are passed to the constructor.")
           .wait()
           .unwrap());
       let result = self.contract.unwrap().query("greet", (self.acc_addr, ), None, Options::default(), None);
       let greeting: U256 = result.wait().unwrap();
       println!("Greeting: {:?}", greeting);
    }

    /// Sends a test transaction to the testRPC
    pub fn test() {
    
    }
}
