import mongoose from "mongoose";

const physiciansUnderUders = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    physiciansList: [
      {
        physicianId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        physicianName: {
          type: String,
          required: true,
        },
        specialityType: {
          type: String,
          required: true,
        },
        workingDays: {
          type: String,
        },
        fcmToken: {
          type: String,
          required: true,
        },
        consultation: {
          type: String,
          enum: ["finished", "pending"],
          default: "pending",
          required: true,
        },
        amountPaid: {
          type: Number,
          required: true,
        },
        prescription: [
          {
            medType: String,
            medName: String,
            medDesc: String,
          },
        ],
        profileImage: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("physiciansUnderUders", physiciansUnderUders);
