import { Schema, Types } from 'mongoose';
import { lotteryTypeEnum } from './constants';

const lotterySchema = {
  count: { type: Number },
  initialDepo: { type: Number, required: true },
  // deployTime: { type: Date },
  type: { type: String, enum: lotteryTypeEnum },
  winners: [{ type: String }],
  updatedAt: { type: Date, default: Date.now() },
};

const cronSettingSchema = new Schema(
  {
    lottery: [lotterySchema],
    contractAddress: { type: String, required: true },
    abi: { type: Types.Mixed },
  },
  { timestamps: true }
);

export default cronSettingSchema;
