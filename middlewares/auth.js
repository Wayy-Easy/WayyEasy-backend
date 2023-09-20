import jwt from "jsonwebtoken";

export const requireSignin = (req, res, next) => {
  try {
    if (req.headers["authorization"]?.length > 0) {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (token) {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = user;
        next();
      } else res.status(400).json({ message: "Admin/owner not found" });
    } else res.status(400).json({ message: "Authorization is required" });
  } catch (error) {
    res.status(400).json({ message: "Access denied" });
    console.log(error);
  }
};

export const verifyUser = (req, res, next) => {
  try {
    if (req.headers["authorization"]?.length > 0) {
      const token = req.header["authorization"]?.split(" ")[1];
      const user = jwt.verify(token, process.env.USER_SECRET_KEY);
      req.user = user;
      next();
    } else {
      res.send({ message: "Authorization is required" });
    }
  } catch (error) {
    res.status(400).json({ message: "Access denied" });
    console.log(error);
  }
};

export const doctorsSignin = (req, res, next) => {
  try {
    if (req.headers["authorization"]?.length > 0) {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (token) {
        const user = jwt.verify(token, process.env.DOCTORS_SECRET_KEY);
        req.user = user;
        next();
      } else res.status(400).json({ message: "Doctor not found" });
    } else {
      res.send({ message: "Authorization is required" });
    }
  } catch (error) {
    res.status(400).json({ message: "Access denied" });
    console.log(error);
  }
};
