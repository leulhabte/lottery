// import ganache from 'ganache-cli';
import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';
import { abi, evm } from './build/AddisLottery.json';

const mnemonicPhrase =
  'cruel cluster state kit potato laptop source vocal alcohol security ankle search';
const provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonicPhrase,
  },
  providerOrUrl:
    'https://ropsten.infura.io/v3/9bd34dc9d45247bb95f7e9369e9897cf',
});

// local eth network
export const web3 = new Web3(provider);
// export const web3 = new Web3(
//   new Web3.providers.HttpProvider('http://127.0.0.1:7545')
// );
// export const web3 = new Web3(ganache.provider());

export async function deploy({ initialValue }) {
  const initialDepo = initialValue;
  const address = await web3.eth.getAccounts();
  const lotteryContract = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [web3.utils.toWei(initialDepo)],
    })
    .send({ gas: 3000000, from: address[0] });
  return {
    address: lotteryContract.options.address,
    abi,
    account: address[0],
  };
}
