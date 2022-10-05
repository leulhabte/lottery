/* eslint-disable no-console */
/* eslint-disable import/first */
import path from 'path';
// Initiate app root
global.appRoot = path.resolve(path.resolve());
import cron from 'node-cron';
import connectToDb from './config/mongoose';
import app from './config/express';
import { deployProcesses } from './processes';
import { lotteryType } from './models/CronSetting/constants';
import * as environments from './config/environments';

const dailyTimer = '*/30 * * * * *';
const dailyTimer2 = '*/10 * * * * *';
const dailyTimer3 = '*/4 * * * * *';
// const dailyTimer = '0 */1 * * *';
// const monthlyTimer = '0 0 * * 0';
// const yearlyTimer = '0 0 1 * *';

const startCronJobs = () => {
  cron.schedule(dailyTimer, async () => {
    console.log('Daily cron started.');
    deployProcesses({
      childPath: path.resolve(__dirname, 'tasks', 'pickWinner'),
      lotteryType: lotteryType.DAILY,
      maxIteration: 24,
    });
  });

  // cron.schedule(dailyTimer2, async () => {
  //   console.log('Montly cron started.');
  //   deployProcesses({
  //     childPath: path.resolve(__dirname, 'tasks', 'pickWinner'),
  //     lotteryType: lotteryType.MONTHLY,
  //     maxIteration: 4,
  //   });
  // });

  // cron.schedule(dailyTimer3, async () => {
  //   console.log('Yearly cron started.');
  //   deployProcesses({
  //     childPath: path.resolve(__dirname, 'tasks', 'pickWinner'),
  //     lotteryType: lotteryType.YEARLY,
  //     maxIteration: 12,
  //   });
  // });
};

const start = async () => {
  await connectToDb();
  app.listen(environments.port, () => {
    console.log(
      `[${environments.nodeEnv}] Server running on localhost:${environments.port}`
    );
    // startCronJobs();
  });
};

start();
export default app;
