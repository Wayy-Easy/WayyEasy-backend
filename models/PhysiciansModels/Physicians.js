import mongoose from "mongoose";
import bcrypt from "bcrypt";

const physiciansSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    qualification: {
      type: String,
    },
    workingDays: {
      type: String,
    },
    specialityType: {
      type: String,
      enum: [
        "General Surgeons",
        "Eye",
        "Dental",
        "Allergists",
        "Anesthesiologists",
        "Orthopedics",
        "Cardiologists",
        "Gastroenterologists",
        "Hematologists",
        "Obstetrics and Gynecologists",
        "Dermatologists",
        "Pediatrics",
        "Radiologists",
        "Colon and Rectal Surgeons",
        "General Surgery",
        "Ophthalmologists",
        "Critical Care Medicine Specialists",
        "Chest Medicine",
        "Anesthesists",
        "Pathologists",
        "ENT",
        "Infectious Disease Specialists",
        "Internists",
        "Nephrologists",
        "Neurologists",
        "Oncologists",
        "Physiatrists",
        "Plastic Surgeons",
        "Rheumatologists",
        "Urologists",
      ],
    },
    ratings: [
      {
        user_id: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        ratings: {
          type: String,
          required: true,
        },
        message: {
          type: String,
        },
      },
    ],
    badge: {
      type: String,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      default: "doctor",
      required: true,
    },
    mobile: {
      type: String,
      // required: true,
      trim: true,
    },
    userLists: [
      {
        userId: mongoose.Types.ObjectId,
      },
    ],
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    proofDocs: {
      type: String,
    },
    shiftStart: {
      type: String,
    },
    shiftEnd: {
      type: String,
    },
    firebaseId: {
      type: String,
    },
    address: {
      type: String,
    },
    fcmToken: {
      type: String,
    },
    price: {
      type: Number,
    },
    isFull: {
      type: Boolean,
      default: false,
    },
    available: {
      type: Boolean,
      enum: [true, false],
      default: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["inActive", "active", "pending", "rejected"],
      default: "inActive",
      required: true,
    },
  },
  { timestamps: true }
);

physiciansSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(this.password, salt);
    this.password = hashed_password;
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Physician", physiciansSchema);
