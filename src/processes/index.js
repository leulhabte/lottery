/* eslint-disable no-console */
import { spawn } from 'child_process';

// eslint-disable-next-line import/prefer-default-export
export const deployProcesses = ({ childPath, lotteryType, maxIteration }) => {
  const child = spawn('babel-node', [childPath, lotteryType, maxIteration]);

  child.stderr.on('data', (data) => {
    console.error(`stderr:[${lotteryType}] ${data}`);
  });

  child.stdout.on('data', (data) => {
    console.error(`stdout:[${lotteryType}] ${data}`);
  });

  child.on('error', (error) => {
    console.error(`error:[${lotteryType}] ${error.message}`);
  });

  child.on('close', (code) => {
    console.log(`${lotteryType} process exited with code ${code}.`);
  });
};
