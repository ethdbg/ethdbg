#! /usr/bin/env node
const fs = require('fs');
const XRegExp = require('xregexp');
const Path = require('path');
const augurPath = './examples/example_solidity/Augur/Augur.sol'
const hashmap = require('hashmap');

function getImports(path) {
  const source = fs.readFileSync(path, 'utf8');
  const cwd = Path.dirname(path);
  const rx = /import \\?'([a-zA-Z\_\-\d\/\.sol]+)\\?';/gi; // eslint-disable-line
  let sourceObj = {};
  if (source.match(rx).length === 0) return 0;
  XRegExp.forEach(source, rx, (match) => {
    const lib = `${cwd}/${match[1]}`;
    if (!fs.existsSync(lib)) {
      throw new Error(
        `file ${lib} required in solidity file '${path}' does not exist`
      );
    }
    sourceObj[lib] = fs.readFileSync(lib, 'utf8');
  });
  return sourceObj;
}


let imports = getImports(augurPath);
console.log(Object.keys(imports));
