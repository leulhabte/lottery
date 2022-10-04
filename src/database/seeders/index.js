/* eslint-disable no-console */

import fs from 'fs';
import parseArgs from 'minimist';
import path from 'path';
import connectToDb from '../../config/mongoose';

const argv = parseArgs(process.argv.slice(2), {});

/**
 * Initiate Avialable Seeders
 * @returns {Promise<Array>}
 */
const initializeSeeders = () =>
  new Promise((resolve, reject) => {
    const seederPath = path.join(process.cwd(), 'src/database/seeders');
    fs.readdir(seederPath, (err, files) => {
      if (err) reject(err);
      else {
        const seeders = [];
        files
          .filter((fileName) => fileName.match(/\.(seeder.js)$/i))
          .forEach((fileName) => {
            // eslint-disable-next-line import/no-dynamic-require, global-require
            const seeder = require(path.join(seederPath, fileName));
            seeders[seeder.order] = seeder;
          });

        resolve(seeders);
      }
    });
  });

const connection = connectToDb();

connection
  .then((dbConnection) => {
    console.log('✅ Database connection successful');
    initializeSeeders()
      .then((seeders) => {
        if (seeders) {
          const failedSeeders = [];

          // Format failed seeders and concatenate them into a string
          const formatFailedSeeders = () =>
            failedSeeders.reduce((formattedString, failedSeeder) => {
              if (failedSeeders.length === 1) return failedSeeder;
              if (
                failedSeeders.indexOf(failedSeeder) ===
                failedSeeders.length - 1
              )
                formattedString.concat(`and ${failedSeeder}`);
              else formattedString.concat(`${failedSeeder}, `);
              return formattedString;
            }, '');

          let success = true;
          console.log('🌱 Seeding database...');

          if (argv.name) {
            const selectedSeeder = seeders.find(
              (seeder) => seeder.name === argv.name
            );

            if (selectedSeeder) {
              console.log(`🌱 Seeding Collection ${argv.name}`);
              selectedSeeder
                .seed(argv.f)
                .then((result) => {
                  if (result) console.log('✅ Seeding successful');
                })
                .catch((err) => {
                  if (typeof err === 'string') console.log(`❌ ${err}`);
                  else console.log(err);
                });
            } else
              console.log(
                `🔴 A seeder with the name ${argv.name} does not exist`
              );
          } else {
            seeders
              .reduce((promise, seeder) => {
                const { name } = seeder;
                return promise
                  .then(() => {
                    return seeder.seed(argv.f).then((result) => {
                      if (result) console.log(`✅ Finished seeding ${name}`);
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    success = false;
                    failedSeeders.push(name);
                  });
              }, Promise.resolve())
              .then(() => {
                if (success) console.log('✅ Seeding successful');
                else {
                  console.log(
                    failedSeeders.length === seeders.length
                      ? '🟠 All seeders have failed'
                      : `🟠 The ${formatFailedSeeders()} seeder${
                          failedSeeders.length > 1 ? 's have' : ' has'
                        } failed`
                  );
                }
              })
              .finally(() => {
                dbConnection.close();
              });
          }
        } else {
          console.log('🔴 No database seeders found');
        }
        return true;
      })
      .catch((err) => {
        console.log(err);
        dbConnection.close();
      });
  })
  .catch((err) => console.log(err));
