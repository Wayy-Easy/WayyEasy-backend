import Model from "../../models/auth/ownerModel.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const data = req.body;

  try {
    const existingUser = await Model.findOne({ email: data.email });

    if (existingUser)
      return res.status(409).json({ message: "User already exists." });

    const result = await Model.create(data);
    const token = jwt.sign(
      { _id: result._id.toString(), role: result.role.toString() },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    res.cookie("ownerToken", token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    });
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Model.findOne({ email });

    if (!user) return res.status(404).json("User not found");

    if (user) {
      if (user.authenticate(password)) {
        // const token = await user.generateAuthToken();
        const token = jwt.sign(
          { _id: user._id.toString(), role: user.role.toString() },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1d" }
        );
        res.cookie("ownerToken", token, {
          expires: new Date(Date.now() + 3600000),
          httpOnly: true,
        });
        res.status(200).json({ user, token });
      } else return res.status(406).json("Incorrect credentails");
    }
  } catch (error) {
    console.error(error);
    res.status(422).send(error);
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("ownerToken");
    res.status(200).send("Logout successful.");
  } catch (error) {
    console.error(error);
    res.status(422).send(error);
  }
};
