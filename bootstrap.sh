#! /bin/bash
git submodule init -- .
git submodule update --recursive -- .
cd ./client_lib/ &&
npm install &&
cd ../ganache-core/ &&
npm install &&
cd ../ethereumjs-vm &&
npm install
