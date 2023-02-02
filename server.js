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
import userRoutes from "./routes/userRoutes.js";
//physicians routes
import physicians from "./routes/physiciansRoute/physicians.js";
import usersBookedPhysicians from "./routes/physiciansRoute/usersBookedPhysician.js";
//opd routes
import opds from "./routes/opdRoutes/opds.js";
//path routes
import pathLabs from "./routes/pathLabsRoute/pathLabs.js";
import { verifyAuth } from "./middlewares/auth.js";

const app = express();
dotEnv.config();
app.use(cors());
app.use(express.json({ limit: "100mb", extended: true }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 2001;

app.get("/", (req, res) => {
  res.send("WayyEasy server is running successfully");
});

app.use("/files/images", verifyAuth, express.static("files/images"));

//hospital
app.use("/doctor", doctorRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/owner", ownerRoutes);
app.use("/ratings", ratingRoutes);
app.use("/room", roomRoutes);

//user
app.use("/user", userRoutes);

// doctors
app.use("/physicians", physicians);
app.use("/physicianBookedByUsers", usersBookedPhysicians);

// opds
app.use("/opdRoutes", opds);

// pathLabs
app.use("/pathLabs", pathLabs);

mongoose
  .connect(
    // "mongodb://localhost:27017"
    process.env.MONGO_CONNECTION_URL
    , { useNewUrlParser: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Successfully connected to ${PORT}`))
  )
  .catch((error) => console.log("error: ", error));