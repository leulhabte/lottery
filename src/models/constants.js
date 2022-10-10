import { generateEnumArrayFromObject } from '../utils';

// eslint-disable-next-line import/prefer-default-export
export const modelNames = {
  CRONSETTING: 'CronSetting',
  USERS: 'Users',
};

export const modelNamesEnum = generateEnumArrayFromObject(modelNames);
