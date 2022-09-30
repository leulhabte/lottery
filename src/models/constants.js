import { generateEnumArrayFromObject } from '../utils';

// eslint-disable-next-line import/prefer-default-export
export const modelNames = {
  CRONSETTING: 'CronSetting',
};

export const modelNamesEnum = generateEnumArrayFromObject(modelNames);
