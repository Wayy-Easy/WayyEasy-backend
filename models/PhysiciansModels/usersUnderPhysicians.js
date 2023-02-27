import mongoose from "mongoose";

const usersUnderPhysicians = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    userList: [
      {
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
        name: {
          type: String,
          required: true,
        },
        fcmToken: {
          type: String,
          required: true,
        },
        age: {
          type: String,
          required: true,
        },
        amountPaid: {
          type: Number,
          required: true,
        },
        profileImage: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("usersUnderPhysicians", usersUnderPhysicians);
