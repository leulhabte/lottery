import { generateEnumArrayFromObject } from '../../utils';

export const lotteryType = {
  DAILY: 'daily',
  MONTHLY: 'weekly',
  YEARLY: 'monthly',
};

export const lotteryTypeEnum = generateEnumArrayFromObject(lotteryType);

/* Setting the initial bet value for each lottery type. */
export const lotteryInitialBetValue = {
  daily: 0.001, // ETH
  weekly: 0.002, // ETH
  monthly: 0.003, // ETH
};

export const lotteryInitialBetValueEnum = generateEnumArrayFromObject(
  lotteryInitialBetValue
);

/* This is the max number of lottery that can be created for each type. */
export const lotteryMaxCount = {
  daily: 24,
  weekly: 4,
  monthly: 12,
};

export const lotteryMaxCountEnum = generateEnumArrayFromObject(lotteryMaxCount);

/* This is the cron schedule time for the lottery. */
export const cronScheduleTime = {
  daily: '*/10 * * * * *',
  // daily: '0 */1 * * *',
  weekly: '0 0 * * 0',
  monthly: '0 0 1 * *',
};
export const cronScheduleTimeEnum = generateEnumArrayFromObject(
  cronScheduleTime
);

export const currency = {
  wei: 'wei',
  gwei: 'gwei',
  ether: 'ether',
};

export const currencyEnum = generateEnumArrayFromObject(currency);
