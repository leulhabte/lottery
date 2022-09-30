import path from 'path';
import fs from 'fs-extra';
import solc from 'solc';

const buildPath = path.resolve(__dirname, 'build');
const contractPath = path.resolve(__dirname, 'contracts', 'lottery.sol');
const source = fs.readFileSync(contractPath, 'utf-8');

fs.removeSync(buildPath);

const input = {
  language: 'Solidity',
  sources: {
    file: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)))?.contracts?.file
  ?.AddisLottery;

fs.ensureDirSync(buildPath);
fs.outputJSONSync(path.resolve(buildPath, 'AddisLottery.json'), output);
