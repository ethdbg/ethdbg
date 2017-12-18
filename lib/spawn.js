const { spawn } = require('child_process');
const dargs = require('dargs');
const { sleep } = require('./utils');
const { events } = require('./types');

// create some args
const args = {
  fork: false,
  port: 8545,
  loggerLevel: 6,
};

async function debugProviderExample() {
  // spawn your Program connected to the DebugProvider
  // passing in arguments to the constructor as an array
  const ethdbg = spawn('./ethdbg.js', dargs(args));

  // setup events 
  ethdbg.stdout.on('data', (data) => {
    console.log(data.toString());
  })

  ethdbg.on('error', (err) => {
    console.log('error ', err);
  });

  ethdbg.on('disconnect', (msg) => {
    console.log('disconnect ', msg);
  });

  ethdbg.on('exit', (code) => {
    console.log('exit ', code);
  });

  ethdbg.on('message', (msg) => {
    console.log('message ', msg);
  });

  ethdbg.stderr.on('data', (data) => {
    console.log(`STDERR: ${data}`);
  });

  await sleep(3000); // do some work
  try {
    ethdbg.stdin.write(events.start);
  } catch (err) {
    console.log(err);
  }
} debugProviderExample();


