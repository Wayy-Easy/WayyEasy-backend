import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Hospital", hospitalSchema);
