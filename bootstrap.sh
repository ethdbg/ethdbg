#! /bin/bash
git submodule init -- .
git submodule update --recursive -- .
npm install &&
cd ganache-core/ &&
npm install &&
cd ../ethereumjs-vm &&
npm install
cd ../testrpc &&
npm install
