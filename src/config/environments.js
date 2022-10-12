import Joi from 'joi';
import dotenv from 'dotenv';

// Initiate dotenv to interact with .env file values
dotenv.config();

// Environment variables validation schema
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'test', 'production')
    .default('development'),
  MONGO_URL: Joi.string().required().description('MongoDb connection URL'),
  MONGO_TEST_URL: Joi.string().required().description('Mongo Test DB URL'),
  PORT: Joi.number().default(5000),
  JWT_KEY: Joi.string().required(),
  APP_NAME: Joi.string().required(),
  APP_DOMAIN: Joi.string().required(),
  MnemonicPhrase: Joi.string().required(),
  providerUrl: Joi.string().required(),
  ADMIN_EMAIL: Joi.string().required(),
  ADMIN_PASSWORD: Joi.string().required(),
  COOKIE_PASSWORD: Joi.string().required(),
  COOKIE_NAME: Joi.string().required(),
})
  .unknown()
  .required();

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Env vars validation error: ${error.message}`);
}

export const nodeEnv = value.NODE_ENV;
export const port = value.PORT;
export const mongoUrl =
  value.NODE_ENV === 'test' ? value.MONGO_TEST_URL : value.MONGO_URL;
export const jwtKey = value.JWT_KEY;
export const mnemonicPhrase = value.MnemonicPhrase;
export const appDomain = value.APP_DOMAIN;
export const appName = value.APP_NAME;
export const url = value.providerUrl;
export const adminEmail = value.ADMIN_EMAIL;
export const adminPass = value.ADMIN_PASSWORD;
export const cookieName = value.COOKIE_NAME;
export const cookiePassword = value.COOKIE_PASSWORD;
