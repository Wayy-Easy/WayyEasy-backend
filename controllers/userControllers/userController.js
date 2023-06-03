import bcrypt from "bcrypt";
import lodash from "lodash";
import springedge from "springedge";
import User from "../../models/userModels/userModel.js";
import userOTPModel from "../../models/userModels/userOTPModel.js";
import PhysicianRatings from "../../models/PhysiciansModels/PhysicianRatings.js";
import Physicians from "../../models/PhysiciansModels/Physicians.js";
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
  /*
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

      await userOTPModel.deleteMany({
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
  */



  
  //Firebase mobile auth

  const existingUser = await User.findOne({ number: req.body.number });
  if (existingUser) {
    const user = await User.findByIdAndUpdate(existingUser._id, existingUser, {
      new: true,
    });
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

    return res.status(201).send({
      message: "User created successfully",
      success: true,
      token: token,
      data: result,
    });
  }
  l̥;
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

export const getUser = async (req, res) => {
  try {
    const userData = await User.findById(req.user._id);
    res.status(200).send(userData);
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: error.message });
  }
};

export const updateFCMToken = async (req, res) => {
  let data = req.body;

  try {
    data = { ...data, fcmToken: req.body.fcmToken };
    await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
    });

    res.status(201).json({ message: "Token updated." });
  } catch (error) {
    console.error("error 84: ", error);
    res.json({ message: error.message });
  }
};

export const ratePhysician = async (req, res) => {
  const { physicianId = "" } = req.params;

  try {
    let existingData = await PhysicianRatings.findOne({ physicianId });
    if (existingData) {
      await PhysicianRatings.updateOne(
        { physicianId },
        {
          $push: {
            ratings: {
              user_id: req.user._id,
              ratings: req.body.physiciansRatings.rating,
              message: req.body.physiciansRatings.review,
              status: req.body.physiciansRatings.status,
              userImage: req.body.physiciansRatings.userImage,
              username: req.body.physiciansRatings.username,
            },
          },
        }
      );
    } else {
      await PhysicianRatings.create({ physicianId });

      await PhysicianRatings.updateOne(
        { physicianId },
        {
          $push: {
            ratings: {
              user_id: req.user._id,
              ratings: req.body.physiciansRatings.rating,
              message: req.body.physiciansRatings.review,
              status: req.body.physiciansRatings.status,
              userImage: req.body.physiciansRatings.userImage,
              username: req.body.physiciansRatings.username,
            },
          },
        }
      );
    }

    res.send({ message: "Successfully Rated" });
  } catch (error) {
    console.log("PhysicianRatings error: " + error.message);
  }
};
