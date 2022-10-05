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
    initialDepo,
    currency,
  } = Array.from(lottery).find((item) => item.type === lotteryType);

  const resetLottery = !(count <= maxIteration);

  // eslint-disable-next-line no-console
  if (resetLottery) console.log(`Full ${lotteryType} complete.`);

  const lotteryContract = await new web3.eth.Contract(
    contract.abi,
    contractAddress
  );

  const increaseRate = initialDepo * rate + initialDepo;

  const chooseWinner = await lotteryContract.methods
    .pickWinner(web3.utils.toWei(`${increaseRate.toFixed(10)}`, currency))
    .send({ from: account, gas: '1000000' });

  // Listen to emitted event
  const lotteryWinner = chooseWinner.events.LogWinner?.returnValues?.winner;

  if (lotteryWinner) {
    updateObject['lottery.$.winners'] = [lotteryWinner, ...winners];
  }
  updateObject['lottery.$.count'] = resetLottery ? 1 : count + 1;
  updateObject['lottery.$.initialDepo'] = resetLottery
    ? lotteryInitialBetValue[lotteryType]
    : increaseRate;
  updateObject['lottery.$.updatedAt'] = Date.now();

  await CronSetting.updateOne(
    { lottery: { $elemMatch: { type: lotteryType } } },
    { $set: updateObject }
  );
}

export default updateContract;
