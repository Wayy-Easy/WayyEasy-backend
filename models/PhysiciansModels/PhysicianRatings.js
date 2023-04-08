import mongoose from "mongoose";

const physiciansRatingSchema = new mongoose.Schema(
  {
    physicianId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    ratings: [
      {
        user_id: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        ratings: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["success", "failed", "pending"],
          default: "pending",
          required: true,
        },
        userImage: {
          type: String,
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        message: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("PhysicianRating", physiciansRatingSchema);
