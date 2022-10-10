import { startSession } from 'mongoose';
import Users from '../../models/Users';
import { modelNames } from '../../models/constants';
import { adminEmail, adminPass } from '../../config/environments';
import bcrypt from 'bcrypt';

// order of excution
const order = 2;
// Seeder name
const name = modelNames.USERS;

/**
 * Seeds coffeProperties collection with initial values
 * @param {Boolean} force
 * @returns {Promise<Any>}
 */
const seed = async (force) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const session = await startSession();

    try {
      const documentCount = await Users.countDocuments();
      if (documentCount === 0 || force) {
        if (documentCount) {
          // eslint-disable-next-line no-console
          console.log(`Collection contains ${documentCount} documents`);

          await Users.deleteMany({});

          // eslint-disable-next-line no-console
          console.log('✅ Collection drop successful');
        }
        await session.withTransaction(async () => {
          const superUser = {
            email: adminEmail,
            super: true,
          };

          superUser.encryptedPassword = await bcrypt.hash(adminPass, 10);

          const superAdmin = new Users(superUser);

          await superAdmin.save();
          await session.commitTransaction();
          resolve(superAdmin);
        });
      } else {
        const msg = `🔴 The ${name} collection contains one or more documents. Use the --f option to reseed records.`;
        throw msg;
      }
    } catch (error) {
      reject(error);
    } finally {
      await session.endSession();
    }
  });
};

export { order, name, seed };
