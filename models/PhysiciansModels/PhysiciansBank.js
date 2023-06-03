import mongoose from "mongoose";

const physiciansBank = new mongoose.Schema(
  {
    physicianId: {
      type: mongoose.Types.ObjectId,
      ref: "Physician",
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    ifscNumber: {
      type: String,
      required: true,
    },
    accountHolderName: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("physiciansBank", physiciansBank);
