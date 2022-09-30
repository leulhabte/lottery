/* eslint-disable import/first */
import path from 'path';
// Initiate app root
global.appRoot = path.resolve(path.resolve());
import * as environments from './config/environments';
import connectToDb from './config/mongoose';
import app from './config/express';
import cron from 'node-cron';

const connection = connectToDb();

const dailyTimer = '0 */1 * * *';
const monthlyTimer = '0 0 * * 0';
const yearlyTimer = '0 0 1 * *';

cron.schedule(dailyTimer, async () => {});

const start = async () => {};

connection
  .on('open', () => start)
  .on('error', console.log)
  .on('disconnected', Connect);

export default app;
