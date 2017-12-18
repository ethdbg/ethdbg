const { expect } = require('chai');
const Logger = require('./../lib/logger');
const Contract = require('./../lib/contract');

describe('Contract', function () {
    describe('#constructor(logger, name, options)', function () {
        it('should instantiate class successfully given source', function () {
            const logger = new Logger(1);
            const options = {
                'source': "(2**800 + 1) - 2**800"
            }
            const contract = new Contract(logger, 'test', options);
        });
    });
});
