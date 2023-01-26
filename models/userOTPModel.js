import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: false,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    expireAt: {
      type: Date,
      default: new Date(new Date().valueOf() + 1800000),
      expires: 1800000,
    },
  },
  { timestamps: true }
);

export default mongoose.model("otp", otpSchema);
