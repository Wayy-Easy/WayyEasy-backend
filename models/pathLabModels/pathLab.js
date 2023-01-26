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
    city: {
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
    userRatings: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        message: {
          type: String,
        },
        name: {
          type: String,
          required: true,
        },
        ratings: { type: Number, min: 1, max: 5, required: true, trim: true },
      },
    ],
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

export default mongoose.model("PathLab", hospitalSchema);
