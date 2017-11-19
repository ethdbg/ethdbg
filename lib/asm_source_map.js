const solc = require('solc');

class AsmSourceMap {

  constructor(source, contract_name) {
    this.source = source;
    this.contract_name = contract_name;
    
  }
}

module.exports = AsmSourceMap;
