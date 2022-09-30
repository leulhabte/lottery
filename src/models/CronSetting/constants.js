import { generateEnumArrayFromObject } from '../../utils';

export const lotteryType = {
  DAILY: 'daily',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

export const lotteryTypeEnum = generateEnumArrayFromObject(lotteryType);
