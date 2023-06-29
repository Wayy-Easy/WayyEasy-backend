import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ownerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    hashed_password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "opd", "pathLab"],
      required: true,
    },
  },
  { timestamps: true }
);

ownerSchema.virtual("password").set(function (password) {
  this.hashed_password = bcrypt.hashSync(password, 12);
});

ownerSchema.methods = {
  authenticate: function (password) {
    return bcrypt.compareSync(password, this.hashed_password);
  },
};

//To create a token for Auth during login
// ownerSchema.methods.generateAuthToken = async function () {
//   const user = this;
//   const token = jwt.sign(
//     { _id: user._id.toString() },
//     process.env.JWT_SECRET_KEY,
//     { expiresIn: "1h" }
//   );
//
//   user.tokens = user.tokens.concat({ token });
//   await user.save();

//   return token;
// };

export default mongoose.model("Owner", ownerSchema);
