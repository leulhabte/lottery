import { startSession } from 'mongoose';
import CronSettings from '../../models/CronSetting';
import {
  currency,
  lotteryInitialBetValue,
  lotteryTypeEnum,
} from '../../models/CronSetting/constants';
import { modelNames } from '../../models/constants';
import { deploy } from '../../ethereum/deploy';

// order of excution
const order = 1;
// Seeder name
const name = modelNames.CRONSETTING;

/**
 * Seeds coffeProperties collection with initial values
 * @param {Boolean} force
 * @returns {Promise<Any>}
 */
const seed = async (force) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const session = await startSession();

    try {
      const documentCount = await CronSettings.countDocuments();
      if (documentCount === 0 || force) {
        if (documentCount) {
          // eslint-disable-next-line no-console
          console.log(`Collection contains ${documentCount} documents`);

          await CronSettings.deleteMany({});

          // eslint-disable-next-line no-console
          console.log('✅ Collection drop successful');
        }
        await session.withTransaction(async () => {
          const lotteries = [];
          let contractAbi;
          let providerAccount;

          await Promise.all(
            lotteryTypeEnum.map(async (type) => {
              const { address, abi, account } = await deploy({
                initialValue: `${lotteryInitialBetValue[type]}`,
              });
              contractAbi = abi;
              providerAccount = account;
              const lottery = {
                count: 1,
                initialDepo: lotteryInitialBetValue[type],
                type,
                winners: [],
                contractAddress: address,
                currency: currency.ether,
                initialPotValue: 0,
              };

              lotteries.push(lottery);
            })
          );

          const newContract = new CronSettings({
            lottery: lotteries,
            abi: contractAbi,
            account: providerAccount,
          });

          const deployedContracts = await newContract.save({ session });
          await session.commitTransaction();
          resolve(deployedContracts);
        });
      } else {
        const msg = `🔴 The ${name} collection contains one or more documents. Use the --f option to reseed records.`;
        throw msg;
      }
    } catch (error) {
      reject(error);
    } finally {
      await session.endSession();
    }
  });
};

export { order, name, seed };
