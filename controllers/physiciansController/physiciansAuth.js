import Model from "../../models/PhysiciansModels/Physicians.js";
import UserListUnderDoctor from "../../models/PhysiciansModels/usersBookedPhysician.js";
import User from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import fs from "fs";

export const signup = async (req, res) => {
  const data = req.body;
  let result, token;

  try {
    const existingUser = await Model.findOne({
      $or: [{ email: data.email }, { mobile: data.mobile }],
    });

    if (existingUser) return res.json({ message: "User already exists" });

    result = await Model.create(data);
    token = jwt.sign(
      { _id: result._id.toString(), role: result.role.toString() },
      process.env.DOCTORS_SECRET_KEY
      //   { expiresIn: "1d" }
    );
    res.cookie("ownerToken", token, {
      expires: new Date(Date.now() + 36000000000),
      httpOnly: true,
    });
    res.status(201).json({
      result,
      token,
      message: "User created successfully",
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  const { email, mobile, password } = req.body;

  try {
    const result = await Model.findOne({
      $or: [{ email: email }, { mobile: mobile }],
    });

    if (!result) return res.json({ message: "User not found" });

    if (result) {
      if (result.authenticate(password)) {
        // const token = await user.generateAuthToken();
        const token = jwt.sign(
          { _id: result._id.toString(), role: result.role.toString() },
          process.env.DOCTORS_SECRET_KEY
          //   { expiresIn: "1d" }
        );
        // res.cookie("ownerToken", token, {
        //   expires: new Date(Date.now() + 36000000000),
        //   httpOnly: true,
        // });
        res.status(200).json({ result, token, message: "Login Successful" });
      } else return res.json({ message: "Incorrect credentails" });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("ownerToken");
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error(error);
    res.json({ message: error.message });
  }
};

export const updateToken = async (req, res) => {
  let data = req.body;
  let updatedPhysician,
    userData,
    bookedUsersList = [];
  try {
    data = { ...data, fcmToken: req.body.fcmToken };
    updatedPhysician = await Model.findByIdAndUpdate(req.user._id, data, {
      new: true,
    });

    bookedUsersList = await UserListUnderDoctor.findOne({
      doctorId: updatedPhysician?._id,
    });

    for (let i = 0; i < bookedUsersList?.userList?.length; i++) {
      userData = await User.updateOne(
        {
          _id: bookedUsersList?.userList[i]?.userId,
          "physiciansBooked.physicianId": updatedPhysician?._id,
        },
        {
          $set: {
            "physiciansBooked.$.fcmToken": req.body?.fcmToken,
          },
        }
      );
    }

    res.status(201).json({ message: "Token updated." });
  } catch (error) {
    console.error("error 84: ", error);
    res.json({ message: error.message });
  }
};

export const editPhysicians = async (req, res) => {
  let data = req.body;
  let imageToUPdate = null,
    documentImgToUpdate = null,
    newDocumentImg = data?.proofDocs,
    existingUser,
    newImage = data?.image;

  if (newImage) {
    try {
      existingUser = await Model.findById(req.user._id);
      imageToUPdate =
        "physician_" +
        Math.round(Math.random() * 10000).toString() +
        "d" +
        Date.now() +
        ".jpg";

      documentImgToUpdate =
        "physician_doc_" +
        Math.round(Math.random() * 10000).toString() +
        "d" +
        Date.now() +
        ".jpg";

      data = {
        ...data,
        image: `files/images/${imageToUPdate}`,
        proofDocs: `files/images/${documentImgToUpdate}`,
      };
    } catch (error) {
      res.send({ message: error.message });
    }
  }

  try {
    const updatedPhysicians = await Model.findByIdAndUpdate(
      data.mongoId,
      data,
      {
        new: true,
      }
    );

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
          console.log("data", error);
        }
      });

      if (existingUser?.image) {
        1;
        try {
          fs.unlinkSync(existingUser.image);
        } catch (error) {
          console.log("error 135: ", error);
        }
      }
    }

    if (newDocumentImg) {
      let dir = "files/";

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);

        dir = "files/images/";

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
      }

      let docImagePath = "files/images/" + documentImgToUpdate;

      fs.writeFile(
        docImagePath,
        newDocumentImg,
        { encoding: "base64" },
        (error) => {
          if (error) {
            console.log("data", error);
          }
        }
      );

      if (existingUser?.proofDocs) {
        1;
        try {
          fs.unlinkSync(existingUser.proofDocs);
        } catch (error) {
          console.log("error 135: ", error);
        }
      }
    }
    res.status(202).send(updatedPhysicians);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const getPhysiciansById = async (req, res) => {
  const { physicianId } = req.params;

  try {
    const fetechedPhysicians = await Model.findById(physicianId);
    res.status(200).send(fetechedPhysicians);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const fetchAllPhysicians = async (req, res) => {
  try {
    const fetchedPhysicians = await Model.find({ status: "active" });
    res.status(200).send(fetchedPhysicians);
  } catch (error) {
    res.json({ message: error.message });
  }
};
