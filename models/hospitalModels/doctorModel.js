import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    hospital: {
        type: mongoose.Types.ObjectId,
        ref: "Hospital",
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "Owner",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: String,
        required: false,
        trim: true
    },
    qualification: {
        type: String,
        required: false,
        trim: true
    },
    specialist: {
        type: String,
        required: false,
        trim: true
    },
    charges: {
        type: String,
        required: false,
        trim: true
    },
    experience: {
        type: String,
        required: false,
        trim: true
    },
    mobile: {
        type: String,
        required: false,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    image: {
        type: String,
        required: false,
        trim: true
    },
}, {timestamps: true})

export default mongoose.model("Doctor", doctorSchema);