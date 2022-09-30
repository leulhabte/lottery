import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import * as environments from './environments';

const modelsPath = path.join(process.cwd(), 'src/models');

// Initialize all models in src/models directory

fs.readdirSync(modelsPath)
  .filter((dir) => dir.indexOf(''))
  // eslint-disable-next-line
  .forEach((dir) => require(path.join(modelsPath, dir)));

const connectToDb = async () => {
  try {
    const connectOptions = {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };
    await mongoose.connect(environments.mongoUrl, connectOptions);
    return mongoose.connection;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Mongo Connection Failed`, error);
    throw error;
  }
};

export default connectToDb;
