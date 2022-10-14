/* eslint-disable no-console */
import connectToDb from '../../config/mongoose';
import updateContract from './updateContract';

const connect = connectToDb();

const excuteTransactions = async () => {
  let dbConnection;
  try {
    dbConnection = await connect;
    await updateContract({
      lotteryType: process.argv[2],
      maxIteration: process.argv[3],
    });
  } catch (error) {
    console.log(error);
  } finally {
    if (dbConnection) await dbConnection.close();
    process.exit(0);
  }
};

excuteTransactions();
