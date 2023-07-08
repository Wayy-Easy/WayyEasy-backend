import Model from "../../models/PhysiciansModels/Physicians.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  const data = req.body;
  let result, token;

  try {
    const existingUser = await Model.findOne({
      $or: [{ email: data.email }, { mobile: data.mobile }],
    });

    if (existingUser) return res.json({ message: "User already exists" });

    const physician = new Model(data);
    result = await physician.save();
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
    console.error(error);
    res.json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  const password = req.body.password;

  try {
    const result = await Model.findOne({
      $or: [{ mobile: req.body.email }, { email: req.body.email }],
    });

    if (!result) return res.json({ message: "User not found" });

    const matchedPassword = await bcrypt.compare(password, result.password);

    if (matchedPassword) {
      const token = jwt.sign(
        { _id: result._id.toString(), role: result.role.toString() },
        process.env.DOCTORS_SECRET_KEY
        //   { expiresIn: "1d" }
      );
      res.status(200).json({ result, token, message: "Login Successful" });
    } else return res.json({ message: "Incorrect credentails" });
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

  try {
    data = { ...data, fcmToken: req.body.fcmToken };
    await Model.findByIdAndUpdate(req.user._id, data, {
      new: true,
    });

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
          fs.unlink(existingUser.image, function (err) {
            if (err) return res.status(404).send(err);
          });
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
    const fetechedPhysician = await Model.findById(physicianId);
    res.status(200).send(fetechedPhysician);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const fetchAllPhysicians = async (req, res) => {
  const { limit = 14, page = 1, searchQuery } = req.query;
  const { dataType } = req.params;
  try {
    if (searchQuery?.length > 0) {
      const startIndex = (Number(page) - 1) * limit;
      const fetchedPhysicians = await Model.find({
        $and: [
          {
            $or: [
              { name: { $regex: req.query.searchQuery, $options: "i" } },
              {
                specialityType: {
                  $regex: req.query.searchQuery,
                  $options: "i",
                },
              },
            ],
          },
          { status: "active" },
        ],
      })
        .limit(limit)
        .skip(startIndex);
      res.status(200).send(fetchedPhysicians);
    } else if (dataType === "fetchAll") {
      const startIndex = (Number(page) - 1) * limit;

      const fetchedPhysicians = await Model.find({ status: "active" })
        .limit(limit)
        .skip(startIndex);
      res.status(200).send(fetchedPhysicians);
    } else {
      const fetchedPhysicians = await Model.find({
        specialityType: dataType,
        status: "active",
      });
      res.status(200).send(fetchedPhysicians);
    }
  } catch (error) {
    console.log("error, ", error);
    res.json({ message: error.message });
  }
};
