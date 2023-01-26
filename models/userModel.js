import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    number: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: String,
      required: false,
      trim: true,
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    city: {
      type: String,
      required: false,
      trim: true,
    },
    pinCode: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    fcmToken: {
      type: String,
      required: false,
      trim: true,
    },
    firebaseId: {
      type: String,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      default: "user",
      required: false,
    },
    physiciansBooked: [
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
        profileImage: {
          type: String,
          required: true,
        },
      },
    ],
    profileImage: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      number: this.number,
      role: this.role,
    },
    process.env.JWT_SECRET_KEY
    // { expiresIn: "365d" }
  );
  return token;
};

export default mongoose.model("User", userSchema);
