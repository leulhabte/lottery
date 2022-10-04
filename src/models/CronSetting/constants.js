import { generateEnumArrayFromObject } from '../../utils';

export const lotteryType = {
  DAILY: 'daily',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

export const lotteryTypeEnum = generateEnumArrayFromObject(lotteryType);

export const lotteryInitialBetValue = {
  daily: 0.001, // ETH
  monthly: 0.002, // ETH
  yearly: 0.003, // ETH
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
