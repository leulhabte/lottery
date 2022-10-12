import Web3 from 'web3';
// import HDWalletProvider from '@truffle/hdwallet-provider';
import { abi, evm } from './build/AddisLottery.json';
// import { url, mnemonicPhrase } from '../config/environments';

// const provider = new HDWalletProvider({
//   mnemonic: {
//     phrase: mnemonicPhrase,
//   },
//   providerOrUrl: url,
// });

// local eth network
// export const web3 = new Web3(provider);
export const web3 = new Web3(
  new Web3.providers.HttpProvider('http://127.0.0.1:7545')
);

export async function deploy({ initialValue }) {
  const address = await web3.eth.getAccounts();
  const lotteryContract = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [`${web3.utils.toWei(initialValue)}`],
    })
    .send({ gas: '3000000', from: address[0] });
  return {
    address: lotteryContract.options.address,
    abi,
    account: address[0],
  };
}
