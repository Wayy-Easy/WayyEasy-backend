import bcrypt from "bcrypt";
import lodash from "lodash";
import springedge from "springedge";
import User from "../models/userModel.js";
import userOTPModel from "../models/userOTPModel.js";
import BookedPhysician from "../models/PhysiciansModels/usersBookedPhysician.js";
import fs from "fs";

export const signup = async (req, res) => {
  try {
    // let otp = Math.floor(100000 + Math.random() * 900000);
    let otp = 765646;
    const salt = await bcrypt.genSalt(10);
    const hashed_otp = await bcrypt.hash(otp.toString(), salt);
    console.log(otp);
    var params = {
      sender: "SEDEMO",
      apikey: "6ojfpx3g160a1vv2279dtl3m42x9qekd",
      to: [req.body.number],
      message: "Hello, This is a test message from spring edge",
      format: "json",
    };

    // springedge.messages.send(params, 5000, function (err, response) {
    //   if (err) {
    //     return console.log(err);
    //   }
    //   console.log(response);
    // });

    await userOTPModel.create({ number: req.body.number, otp: hashed_otp });
    return res.status(201).send({ message: "OTP send successfully!" });
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const otpHolders = await userOTPModel.find({ number: req.body.number });
  if (otpHolders.length === 0)
    return res.status(400).send({ message: "Invalid OTP found!" });

  const rightOTPFound = otpHolders[otpHolders.length - 1];
  const validUser = await bcrypt.compare(req.body.otp, rightOTPFound.otp);

  if (rightOTPFound.number === req.body.number && validUser) {
    const existingUser = await User.findOne({ number: req.body.number });
    if (existingUser) {
      const user = await User.findByIdAndUpdate(
        existingUser._id,
        existingUser,
        {
          new: true,
        }
      );
      const token = user.generateJWT();
      return res.status(201).send({
        message: "User updated successfully",
        success: true,
        token: token,
        data: user,
      });
    } else {
      const user = new User(lodash.pick(req.body, ["number"]));
      const token = user.generateJWT();
      const result = await user.save();
      const deleteOTP = await userOTPModel.deleteMany({
        number: rightOTPFound.number,
      });
      return res.status(201).send({
        message: "User created successfully",
        success: true,
        token: token,
        data: result,
      });
    }
  } else return res.status(400).send({ message: "OTP did not match" });
};

export const updateProfile = async (req, res) => {
  let data = req.body;
  let imageToUPdate = null,
    existingUser,
    newImage = data?.profileImage;

  if (newImage) {
    try {
      existingUser = await User.findById(req.user._id);
      imageToUPdate =
        Math.round(Math.random() * 10000).toString() +
        "d" +
        Date.now() +
        ".jpg";
      data = { ...data, profileImage: `files/images/${imageToUPdate}` };
    } catch (error) {
      console.log("127 ", error);
    }
  }

  try {
    const updatedData = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
    });

    if (newImage) {
      let dir = "files/";

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);

        dir = "files/images/";

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
      }

      let imagePath = "files/images/" + imageToUPdate;

      fs.writeFile(imagePath, newImage, { encoding: "base64" }, (error) => {
        if (error) {
          console.log("data 153 ", error);
        }
      });

      if (existingUser?.profileImage) {
        try {
          fs.unlinkSync(existingUser?.profileImage);
        } catch (error) {
          console.log("error 135: ", error);
        }
      }
    }
    res.status(202).send(updatedData);
  } catch (error) {
    console.log("169 ", error);
    res.status(422).json({ error: error.message });
  }
};

export const updateFCMToken = async (req, res) => {
  let data = req.body;
  if (req.body?.fcmToken) {
    try {
      data = { ...data, fcmToken: req.body.fcmToken };
      const updatedUser = await User.findByIdAndUpdate(req.user._id, data, {
        new: true,
      });

      let bookedPhysicians = [];
      bookedPhysicians = updatedUser?.physiciansBooked?.map(
        (data) => data?.physicianId
      );

      for (let i = 0; i < bookedPhysicians.length; i++) {
        if (bookedPhysicians[i]) {
          await BookedPhysician.updateOne(
            { doctorId: bookedPhysicians[i], "userList.userId": req.user._id },
            {
              $set: {
                "userList.$.fcmToken": req.body?.fcmToken,
              },
            }
          );
        }
      }

      res.status(201).send({ message: "Token updated successfully" });
    } catch (error) {
      console.log("113 ", error);
    }
  }
};

export const getUser = async (req, res) => {
  try {
    const userData = await User.findById(req.user._id);
    res.status(200).send(userData);
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: error.message });
  }
};

export const getPhysiciansBooked = async (req, res) => {
  try {
    const userData = await User.findById(req.user._id);
    res.status(200).send(userData?.physiciansBooked);
  } catch (error) {
    res.json({ error: error.message });
  }
};
