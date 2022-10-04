import { param } from 'express-validator';
import { lotteryTypeEnum } from '../models/CronSetting/constants';

// eslint-disable-next-line import/prefer-default-export
export const getWinnersValidator = () => [
  param('type').isString().isIn(lotteryTypeEnum),
];
