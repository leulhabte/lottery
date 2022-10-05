/* eslint-disable no-undef */
import ganache from 'ganache-cli';
import Web3 from 'web3';
import assert from 'assert';
import { abi, evm } from '../src/ethereum/build/AddisLottery.json';

const web3 = new Web3(ganache.provider());

let lottery;
let accounts;
const initialValue = '5';

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [web3.utils.toWei(initialValue)],
    })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery', () => {
  it('deploys contract', () => {
    assert.ok(lottery.options.address);
  });

  it('place bet, pick winner and set new betting value', async () => {
    const player = accounts[1];
    const nextBettingValue = web3.utils.toWei('10');
    await lottery.methods.bet().send({
      from: player,
      gas: '3000000',
      value: web3.utils.toWei(initialValue),
    });

    await lottery.methods.pickWinner(nextBettingValue).send({
      from: accounts[0],
      gas: '3000000',
    });
    const playerBalance = web3.utils.fromWei(await web3.eth.getBalance(player));
    if (playerBalance < '99.99') assert(false);

    const newContractValue = await lottery.methods.bettingValue().call();

    if (newContractValue !== nextBettingValue) assert(false);
  });
});
