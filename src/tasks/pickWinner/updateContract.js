import CronSetting from '../../models/CronSetting';
import { web3 } from '../../ethereum/deploy';
import { cronSettingNotFound } from '../constants';
import { lotteryInitialBetValue } from '../../models/CronSetting/constants';

async function updateContract({ lotteryType, maxIteration }) {
  const updateObject = {};
  const contract = await CronSetting.findOne();
  if (!contract) throw cronSettingNotFound;
  const { lottery, account } = contract;
  const {
    contractAddress,
    count,
    winners,
    rate,
    priceCut,
    gasCut,
    currency,
  } = Array.from(lottery).find((item) => item.type === lotteryType);

  // MAX ITRATION CHECK
  const resetLottery = !(count < maxIteration);

  // eslint-disable-next-line no-console
  if (resetLottery) console.log(`Full ${lotteryType} complete.`);

  const lotteryContract = await new web3.eth.Contract(
    contract.abi,
    contractAddress
  );

  const initialBettingValue = await lotteryContract.methods
    .bettingValue()
    .call();

  const nextBettingValue =
    parseInt(initialBettingValue, 10) * rate +
    parseInt(initialBettingValue, 10);

  const currentBalance = await lotteryContract.methods.getBalance().call();

  const offValue = parseInt(
    (priceCut / 100) * parseInt(currentBalance, 10),
    10
  );

  const ownerCut = parseInt(offValue * (gasCut / 100), 10);

  const chooseWinner = await lotteryContract.methods
    .pickWinner(
      resetLottery
        ? `${web3.utils.toWei(
            `${lotteryInitialBetValue[lotteryType]}`,
            currency
          )}`
        : `${parseInt(nextBettingValue, 10)}`,
      `${offValue}`,
      `${ownerCut}`
    )
    .send({ from: account, gas: '3000000' });

  // Listen to emitted event
  const lotteryWinner = chooseWinner.events.LogWinner?.returnValues?.winner;

  const initialPotValue = await lotteryContract.methods.getBalance().call();
  const bettingValue = await lotteryContract.methods.bettingValue().call();

  // Update database
  if (lotteryWinner) {
    updateObject['lottery.$.winners'] = [lotteryWinner, ...winners];
  }
  updateObject['lottery.$.count'] = resetLottery ? 1 : count + 1;
  updateObject['lottery.$.initialBettingValue'] = resetLottery
    ? lotteryInitialBetValue[lotteryType]
    : web3.utils.fromWei(bettingValue, currency);
  updateObject['lottery.$.updatedAt'] = Date.now();
  updateObject['lottery.$.initialPotValue'] =
    web3.utils.fromWei(initialPotValue) || 0;

  await CronSetting.updateOne(
    { lottery: { $elemMatch: { type: lotteryType } } },
    { $set: updateObject }
  );
}

export default updateContract;
