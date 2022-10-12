/* eslint-disable no-undef */
import ganache from 'ganache-cli';
import Web3 from 'web3';
import assert from 'assert';
import { abi, evm } from '../src/ethereum/build/AddisLottery.json';

const web3 = new Web3(ganache.provider());

let lottery;
let accounts;
const initialValue = '5';
const gasCutRate = '0.1';

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [web3.utils.toWei(initialValue)],
    })
    .send({ from: accounts[0], gas: '3000000' });
});

describe('Lottery', () => {
  it('deploys contract', () => {
    assert.ok(lottery.options.address);
  });

  it('place bet, pick winner and set new betting value', async () => {
    const player = accounts[1];
    const offValue = web3.utils.toWei(`${0.02 * initialValue}`);
    const gasCut = web3.utils.toWei(`${gasCutRate * offValue}`);
    const nextBettingValue = web3.utils.toWei('10', 'ether');

    const initialContractBalance = await lottery.methods.getBalance().call();

    /* Sending a transaction to the contract to bet. */
    await lottery.methods.bet().send({
      from: player,
      gas: '3000000',
      value: web3.utils.toWei(initialValue),
    });

    /* Picking a winner and setting the new betting value. */
    await lottery.methods.pickWinner(nextBettingValue, offValue, gasCut).send({
      from: accounts[0],
      gas: '3000000',
    });

    const playerBalance = web3.utils.fromWei(await web3.eth.getBalance(player));

    if (playerBalance < '99') assert(false);

    const newContractValue = await lottery.methods.bettingValue().call();
    const newInitialContractBalance = await lottery.methods.getBalance().call();

    /* Checking if the new contract initial value is greater than the previous contract initial value. */
    if (newInitialContractBalance <= initialContractBalance)
      assert(
        false,
        'The new contract intial value must be greater than the pervious initial contract value'
      );

    /* Checking if the new betting value is the same as the next betting value. */
    if (newContractValue !== nextBettingValue)
      assert(false, 'newContractValue must be equal to nextBettingValue');
  });
});
