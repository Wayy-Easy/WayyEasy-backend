import mongoose from "mongoose";

const physicianBookings = new mongoose.Schema(
  {
    physicianId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    consultation: {
      type: String,
      enum: ["finished", "pending"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("physicianBooking", physicianBookings);
