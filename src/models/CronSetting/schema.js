import { Schema } from 'mongoose';
import { currencyEnum, lotteryTypeEnum } from './constants';

const lotterySchema = {
  count: { type: Number },
  initialDepo: { type: Number, required: true },
  type: { type: String, enum: lotteryTypeEnum },
  winners: [{ type: String }],
  contractAddress: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now() },
  rate: { type: Number, default: 0.05, required: true },
  priceCut: { type: Number, default: 20 },
  gasCut: { type: Number, required: true, default: 10 },
  currency: { type: String, enum: currencyEnum, required: true },
  initialPotValue: { type: String },
};

const cronSettingSchema = new Schema(
  {
    lottery: [lotterySchema],
    abi: { type: Schema.Types.Mixed },
    account: { type: String, required: true },
  },
  { timestamps: true }
);

export default cronSettingSchema;
