import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtKey, appDomain } from '../config/environments';

const generateHashedPassword = async (cleanPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(cleanPassword, salt);
  return hashedPassword;
};

const generateJwtToken = (userId, expiresIn = '0.5y') => {
  const token = jwt.sign({ _id: userId }, jwtKey, { expiresIn });
  return token;
};

/**
 *
 * @param {string} passwordOrKey jwt secret key to be used to validate token. For this purpose we will use the user's encrypted password as secretKey
 * @param {string} expiresIn The expiry time.
 */
const generateAccountActivationUrl = (
  passwordOrKey,
  userId,
  email,
  expiresIn = '24h'
) => {
  const token = jwt.sign({ _id: userId }, passwordOrKey, { expiresIn });
  // Change this with the appropirate route that will open your client side and send the token and email to the activate endpoint
  const url = `${appDomain}/activate?token=${token}&email=${email}`;
  return url;
};

/**
 * Provided an object of string constants it returns all values as an array to be used as an enum
 * @param {{}} typesObject an object of types constant
 * @param {string} valueKey if value of key is an object pass in the value key
 */
export const generateEnumArrayFromObject = (typesObject, valueKey) => {
  const enumArray = [];
  if (typeof typesObject === 'object') {
    const keys = Object.keys(typesObject);
    // use for loop to make syncronous
    for (let index = 0; index < keys.length; index += 1) {
      const value = typesObject[keys[index]];

      if (value) {
        const valueToBeAdded = valueKey ? value[valueKey] : value;
        enumArray.push(valueToBeAdded);
      }
    }
  }

  return enumArray;
};
/**
 * Generates random 4 digit pin
 * @returns Number
 */
export const generateFourDigitCode = () => {
  const code = Math.floor(1000 + Math.random() * 9000);
  if (code <= 9999) {
    return code;
  }
  return generateFourDigitCode();
};

/**
 * Extracts and returns file extension from filename string
 * @param {string} fileName the file name
 */
export const extractExtensionFromFileName = (fileName) => {
  if (typeof fileName === 'string') {
    return fileName.split('.').pop(); // returns the last splitted array
  }

  return '';
};

export {
  generateHashedPassword,
  generateJwtToken,
  generateAccountActivationUrl,
};
