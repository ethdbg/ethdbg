# Unit Tests



#### Developer Notes
- **Mocha Note:** Passing arrow functions (“lambdas”) to Mocha is discouraged. Due to the lexical binding of this, such functions are unable to access the Mocha context. For example, the following code will fail due to the nature of lambdas (https://mochajs.org/#assertions)


Create a new file for every class being tested
