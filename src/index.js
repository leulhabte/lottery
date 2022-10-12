/* eslint-disable no-console */
/* eslint-disable import/first */
import path from 'path';
// Initiate app root
global.appRoot = path.resolve(path.resolve());
import cron from 'node-cron';
import connectToDb from './config/mongoose';
import app from './config/express';
import { deployProcesses } from './processes';
import { lotteryTypeEnum } from './models/CronSetting/constants';
import * as environments from './config/environments';
import CronSetting from './models/CronSetting';

/**
 * It takes the cron setting from the database and starts a cron job for each lottery type
 */
const startCronJobs = async () => {
  const cronSetting = await CronSetting.findOne({});

  if (cronSetting?.lottery) {
    lotteryTypeEnum.forEach((type) => {
      const currentLottery = cronSetting.lottery.find(
        (item) => item.type === type
      );
      if (currentLottery)
        cron.schedule(currentLottery.cronTime, async () => {
          console.log(`${type} cron started.`);
          deployProcesses({
            childPath: path.resolve(__dirname, 'tasks', 'pickWinner'),
            lotteryType: type,
            maxIteration: currentLottery.maxIteration,
          });
        });
    });
  }
};

const start = async () => {
  await connectToDb();
  app.listen(environments.port, () => {
    console.log(
      `[${environments.nodeEnv}] Server running on localhost:${environments.port}`
    );
    startCronJobs();
  });
};

start();
export default app;
