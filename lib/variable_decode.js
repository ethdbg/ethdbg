/**
 * How do we get variables from the testRPC into a form we can read?<br>
 * @author Sean Batzel
 * @param {string} name - Source name of the variable
 * @param {string} mem - Current memory value in the blockchain
 * @param {string} type - Variable type
 * @private
 */
class Variable {
    constructor(name, mem, type) {
        this.type = type;
        this.value = this.parseValue(mem);
        this.identifier = name;
    }

    /**
     * Get the actual readable value of the variable.
     * @author Sean Batzel
     * @param {string} mem - Current variable memory value
     * @return {string} - The actual value of the variable
     * @private
     */
    parseValue(mem) {
        return parseInt(mem, 16);
    }
}

/**
 * A structure containing all variables in the current context.
 * @author Sean Batzel
 * @private
 */
class VariableDecode {
    constructor() {
        this.variables = {};
    }

    /**
     * Parse and add variables.
     * @author Sean Batzel
     * @param {string} name - Variable identifier
     * @param {string} type - Variable type
     * @param {string} value - Variable value
     * @private
     */
    addVariable(name, type, value) {
        this.variables[name] = new Variable(name, value, type);
    }

    /**
     * Pull the details for a variable.
     * @author Sean Batzel
     * @param {string} index - The name of the variable we want
     * @return {Variable} - Returned variable object
     * @private
     */
    checkVariable(index) {
        return this.variables[index];
    }

    /**
     * Update new variable values.
     * @author Sean Batzel
     * @param {number} index - Value index to update
     * @param {number} value - Value to update the variable to
     * @private
     */
    updateVariable(index, value) {
        this.variables[index].value = value;
    }
}

module.exports = VariableDecode;