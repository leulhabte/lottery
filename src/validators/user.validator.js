import { body, query } from 'express-validator';
import { strongPasswordRegex } from '../utils/constants';

const createUserValidator = () => [
  body('firstName').isString().withMessage('First name is required'),
  body('lastName').isString().optional(),
  body('email').isEmail().withMessage('A valid email is required'),
  body('password')
    .isString()
    .isLength({ min: 8, max: 60 })
    .withMessage(
      'Password should be at least 8 cahracters and not greater than 60'
    )
    .withMessage((val) => strongPasswordRegex.test(val))
    .withMessage(
      'Password should contain a lower case letter, an upper case letter, a number and one of these symbols (!@#$%^&*).'
    ),
];

const loginValidator = () => [
  body('email').isEmail().withMessage('Email is required to login'),
  body('password').isString().withMessage('password is required'),
];

const validateEmailValidator = () => [
  query('email').isEmail().withMessage('Email is required'),
  query('token').isString().withMessage('validation token is required'),
];

const validateAccountActivate = () => [
  body('email').isEmail().withMessage('Email is required'),
  body('token').isString().withMessage('validation token is required'),
];

export {
  createUserValidator,
  loginValidator,
  validateEmailValidator,
  validateAccountActivate,
};
