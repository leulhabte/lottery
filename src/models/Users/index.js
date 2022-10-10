import mongoose from 'mongoose';
import * as statics from './statics';
import * as methods from './methods';
import userSchema from './schema';
import { modelNames } from '../constants';

userSchema.method(methods);
userSchema.static(statics);

const Users = mongoose.model(modelNames.USERS, userSchema);

export default Users;
