import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotEnv from "dotenv";

//hospital routes
import doctorRoutes from "./routes/hospitalRoutes/doctorRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes/hospitalRoutes.js";
import ownerRoutes from "./routes/hospitalRoutes/ownerRoutes.js";
import ratingRoutes from "./routes/hospitalRoutes/ratingRoutes.js";
import roomRoutes from "./routes/hospitalRoutes/roomsRoutes.js";
//user routes
import userRoutes from "./routes/userRoutes/userRoutes.js";
//physicians routes
import physicians from "./routes/physiciansRoute/physicians.js";
import usersBookedPhysicians from "./routes/physiciansRoute/usersUnderPhysicians.js";
//opd routes
import opds from "./routes/opdRoutes/opds.js";
//path routes
import pathLabs from "./routes/pathLabsRoute/pathLabs.js";
import { doctorsSignin, verifyUser } from "./middlewares/auth.js";

const app = express();
dotEnv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 2001;

app.get("/", (req, res) => {
  res.send("WayyEasy server is running successfully. You can make calls now.");
});

//images for users
app.use("/api/files/images", verifyUser, express.static("files/images"));

//images fro doctors
app.use(
  "/api/doctors/files/images",
  doctorsSignin,
  express.static("files/images")
);

//hospital
app.use("/api/doctor", doctorRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/room", roomRoutes);

//user
app.use("/api/user", userRoutes);

// doctors
app.use("/api/physicians", physicians);
app.use("/api/physicianBookedByUsers", usersBookedPhysicians);

// opds
app.use("/api/opdRoutes", opds);

// pathLabs
app.use("/api/pathLabs", pathLabs);

mongoose
  .connect(
    // "mongodb://127.0.0.1:27017/wayyeasy",
    process.env.MONGO_CONNECTION_URL,
    // process.env.MONGO_TEST_CONNECTION_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() =>
    app.listen(PORT, () => console.log(`Successfully connected to ${PORT}`))
  )
  .catch((error) => console.log("error: ", error));
