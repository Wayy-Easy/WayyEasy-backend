import mongoose from "mongoose";

const adminPayments = new mongoose.Schema(
  {
    physicianId: {
      type: mongoose.Types.ObjectId,
      ref: "Physician",
      required: true,
    },
    amountReceived: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
    },
    amountPaid: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("adminPayments", adminPayments);
