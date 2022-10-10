import { Schema } from 'mongoose';

const cronSettingSchema = new Schema(
  {
    email: { type: String, required: true },
    encryptedPassword: { type: String, required: true },
    super: { type: Boolean },
  },
  { timestamps: true }
);

export default cronSettingSchema;
