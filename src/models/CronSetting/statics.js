import httpStatus from 'http-status';
import APIError from '../../errors/APIError';

/* Creating a new error object that will be thrown if the contract is not found. */
const contractNotFound = new APIError(
  'Contract not found',
  httpStatus.NOT_FOUND
);

/**
 * It updates a cron setting
 * @returns The updated cronSetting
 */
export async function updateCronSetting({ updateObject, matchQuery }) {
  const cronSetting = await this.findOneAndUpdate(matchQuery, updateObject);
  return cronSetting;
}

/**
 * Get the contract from the database.
 * @returns The contract object
 */
export async function getContract() {
  const contract = await this.findOne({});
  if (!contract) throw contractNotFound;
  return contract;
}

/**
 * It finds the contract, filters the lottery array by the type passed in, and returns the filtered
 * array
 * @param type - The type of lottery you want to get the winners for.
 * @returns An array of winners
 */
export async function getWinners(type) {
  const contract = await this.findOne({});
  if (!contract) throw contractNotFound;

  const { lottery } = contract;

  const lotteryType = lottery.filter((item) => item.type === type);
  return lotteryType?.[0]?.winners || [];
}
