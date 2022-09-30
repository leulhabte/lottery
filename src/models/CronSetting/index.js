import mongoose from 'mongoose';
import * as statics from './statics';
import * as methods from './methods';
import cronSettingSchema from './schema';
import { modelNames } from '../constants';

cronSettingSchema.method(methods);
cronSettingSchema.static(statics);

const CronSetting = mongoose.model(modelNames.CRONSETTING, cronSettingSchema);

export default CronSetting;
