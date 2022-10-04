/* eslint-disable no-console */
import connectToDb from '../../config/mongoose';
import updateContract from './updateContract';

const connect = connectToDb();
connect
  .then(async (dbConnection) => {
    await updateContract({
      lotteryType: process.argv[2],
      maxIteration: process.argv[3],
    })
      .catch(console.log)
      .finally(async () => {
        await dbConnection.close();
        process.exit(0);
      });
  })
  .catch(console.log)
  .finally(() => process.exit(0));
