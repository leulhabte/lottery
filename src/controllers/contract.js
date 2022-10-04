import CronSetting from '../models/CronSetting';

/**
 * It gets all the contracts from the database
 * @param req - The request object.
 * @param res - The response object.
 * @param next - This is a function that you call when you want to pass control to the next middleware
 * function in the stack.
 */
export const getContract = async (req, res, next) => {
  try {
    const contracts = await CronSetting.getContract();
    res.send(contracts);
  } catch (error) {
    next(error);
  }
};

/**
 * It gets the winners of a specific type of lottery
 * @param req - The request object.
 * @param res - The response object.
 * @param next - This is a function that you call when you want to pass control to the next middleware
 * function in the stack.
 */
export const getWinners = async (req, res, next) => {
  try {
    const { type } = req.params;
    const winners = await CronSetting.getWinners(type);
    res.send(winners);
  } catch (error) {
    next(error);
  }
};
