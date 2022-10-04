import httpStatus from 'http-status';
import APIError from '../errors/APIError';

// eslint-disable-next-line import/prefer-default-export
export const cronSettingNotFound = new APIError(
  'Cron Setting Not found!',
  httpStatus.NOT_FOUND
);
