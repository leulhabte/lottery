import { generateEnumArrayFromObject } from '../../utils';

export const lotteryType = {
  DAILY: 'daily',
  MONTHLY: 'weekly',
  YEARLY: 'monthly',
};

export const lotteryTypeEnum = generateEnumArrayFromObject(lotteryType);

export const lotteryInitialBetValue = {
  daily: 0.001, // ETH
  weekly: 0.002, // ETH
  monthly: 0.003, // ETH
};

export const lotteryInitialBetValueEnum = generateEnumArrayFromObject(
  lotteryInitialBetValue
);

export const currency = {
  wei: 'wei', // ETH
  gwei: 'gwei', // ETH
  ether: 'ether', // ETH
};

export const currencyEnum = generateEnumArrayFromObject(currency);
