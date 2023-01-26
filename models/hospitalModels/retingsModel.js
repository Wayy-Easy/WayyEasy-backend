import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    hospital: {
        type: mongoose.Types.ObjectId,
        ref: "Hospital",
        required: true
    },
    staffs: {
        type: Number,
        required: false,
    },
    clean: {
        type: Number,
        required: false,
    },
    treatement: {
        type: Number,
        required: false,
    },
    location: {
        type: Number,
        required: false,
    },
    valueForMoney: {
        type: Number,
        required: false,
    },
    average: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: false,
    },
    userName: {
        type: String,
        required: true,
    }
}, { timestamps: true })

export default mongoose.model("Rating", ratingSchema);