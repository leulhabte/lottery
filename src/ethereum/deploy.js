import ganache from 'ganache-cli';
import Web3 from 'web3';
import connectToDb from '../config/mongoose';
import CronSetting from '../models/CronSetting';
import { abi, evm } from './build/AddisLottery.json';

const connection = connectToDb();

// local eth network
const web3 = new Web3(ganache.provider());

async function deploy({ lotteryType }) {
  const initialDepo = 1;
  const address = await web3.eth.getAccounts();
  const lotteryContract = await web3.eth
    .Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: [initialDepo] })
    .send({ gas: 1000000, from: address[0] });

  return {
    address: lotteryContract.options.address,
    abi,
    initialDepo,
    lotteryType,
  };
}
