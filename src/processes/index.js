/* eslint-disable no-console */
import { spawn } from 'child_process';

// eslint-disable-next-line import/prefer-default-export
export const deployProcesses = (childPath) => {
  const child = spawn('babel-node', [childPath]);

  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  child.stdout.on('data', (data) => {
    console.error(`stdout: ${data}`);
  });

  child.on('error', (error) => {
    console.error(`error: ${error.message}`);
  });

  child.on('close', (code) => {
    console.log(`${childPath} process exited with code ${code}`);
  });
};
