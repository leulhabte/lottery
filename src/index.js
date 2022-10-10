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

const dailyTimer = '*/3 * * * * *';
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

  // dont start the cron job its shy,like me, who am i you ask? my name is leul habte i am a shy boii but i am also a dope poii
  // dopi alsina breezy jr that was my facebook name!

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

// 1. _estimatedGas = 3000000 | 0.000000000003eth | 0.0000000041 USD // manager
// bettingValue = 5000000000000000000 wei | 5eth
// potValue = 20000000000000000000 wei | 20eth | 27054.40 USD
// offValue = 4000000000000000000 wei | 4 eth | 5410.88 USD
// winner = 16000000000000000000 wei  16.00eth | 21643.52 USD
