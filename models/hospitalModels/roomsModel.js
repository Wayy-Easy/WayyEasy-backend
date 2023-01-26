import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    rooms: {
      roomType: {
        type: String,
        required: true,
        enum: [
          "Twin Sharing",
          "Premium Twin Sharing",
          "Delux",
          "Premium Deluxe",
          "Suite",
          "Day Care",
          "General",
          "Cabin",
          "Deluxe Suite",
          "Special Economy",
          "CTVS-ICU",
          "CCU",
          "Medical ICU",
          "Neuro ICU",
          "Burn Unit",
          "HDU ICU",
          "Gynae Unit",
          "PICU",
          "Paed Care Unit",
          "Nursery",
          "Neonatal ICU",
          "Casuality",
          "CTVS Step Down",
          "CCU Step Down",
        ],
      },
      total: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      roomDetails: [
        {
          roomNo: {
            type: Number,
            required: true,
          },
          available: {
            type: String,
            enum: ["yes", "no", "pending", "hold"],
            required: true,
          },
          user: [
            {
              user_id: {
                type: mongoose.Types.ObjectId,
              },
              amountPaid: {
                type: String,
                default: "0",
              },
              status: {
                type: String,
                enum: ["pending", "hold", "booked", "discharge", "close"],
              },
              hospitalPiad: {
                type: String,
                default: "0",
              },
              bookingDate: {
                type: Date,
                default: new Date(),
              },
              releaseDate: Date,
            },
          ],
        },
      ],
      image: [
        {
          type: String,
          required: false,
          trim: true,
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
