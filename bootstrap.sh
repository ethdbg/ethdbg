#! /bin/bash
cd ethereumjs-vm/
rm package-lock.json
git pull origin master
cd ../testrpc/
rm package-lock.json
git pull origin master
cd ../ganache-core/
rm package-lock.json
git pull origin master
cd ..
rm pacakge-lock.json
git submodule init -- .
git submodule update --recursive -- .
npm install &&
cd ganache-core/ &&
npm install &&
cd ../ethereumjs-vm &&
npm install
cd ../testrpc &&
npm install
