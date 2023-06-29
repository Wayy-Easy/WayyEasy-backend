import mongoose from "mongoose";

const physicianPrescription = new mongoose.Schema(
  {
    physicianId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    consultationId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    prescription: [
      {
        medType: String,
        medName: String,
        medDesc: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("physicianPrescription", physicianPrescription);
