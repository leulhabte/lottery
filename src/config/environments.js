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
  APP_DOMAIN: Joi.string().required(),
  APP_NAME: Joi.string().required(),
  APP_EMAIL_ADDRESS: Joi.string().email().required(),
  APP_EMAIL_PASSWORD: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_S3_BUCKET_NAME: Joi.string().required(),
  UPLOAD_IMAGE_SIZE_LIMIT_IN_MB: Joi.number().default(5).required(),
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
export const appEmailAddress = value.APP_EMAIL_ADDRESS;
export const appEmailPassword = value.APP_EMAIL_PASSWORD;
export const appDomain = value.APP_DOMAIN;
export const appName = value.APP_NAME;
export const awsAccessKeyId = value.AWS_ACCESS_KEY_ID;
export const awsSecretKey = value.AWS_SECRET_ACCESS_KEY;
export const awsRegion = value.AWS_REGION;
export const awsS3BucketName = value.AWS_S3_BUCKET_NAME;
export const uploadImageSizeLimitInMB = value.UPLOAD_IMAGE_SIZE_LIMIT_IN_MB;
