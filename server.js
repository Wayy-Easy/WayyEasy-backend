import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotEnv from "dotenv";

//admin routes
import paymentRoutes from "./routes/admin/paymentRoutes.js";
import articleRoutes from "./routes/admin/articleRoutes.js";

//hospital routes
import doctorRoutes from "./routes/hospitalRoutes/doctorRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes/hospitalRoutes.js";
import ownerRoutes from "./routes/auth/ownerRoutes.js";
import ratingRoutes from "./routes/hospitalRoutes/ratingRoutes.js";
import roomRoutes from "./routes/hospitalRoutes/roomsRoutes.js";

//user routes
import userRoutes from "./routes/userRoutes/userRoutes.js";

//physicians routes
import physicians from "./routes/physiciansRoute/physicians.js";
import physicianBookings from "./routes/physiciansRoute/physicianBookings.js";
import physicianPrescription from "./routes/physiciansRoute/physicianPriscription.js";
import physicianBank from "./routes/physiciansRoute/physicianBank.js";

//opd routes
import opds from "./routes/opdRoutes/opds.js";

//path routes
import pathLabs from "./routes/pathLabsRoute/pathLabs.js";
import { doctorsSignin, verifyUser } from "./middlewares/auth.js";

//search
import webSearch from "./routes/search/webSearch.js";

const app = express();
dotEnv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 2001;

app.get("/", (req, res) => {
  res.send("WayyEasy server is running successfully!");
});

//admin
app.use("/api/admin/payment", paymentRoutes);
app.use("/api/admin/articles", articleRoutes);

//hospital
app.use("/api/doctor", doctorRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/room", roomRoutes);

//user
app.use("/api/user", userRoutes);

// physicians
app.use("/api/physicians", physicians);
app.use("/api/physicianBookings", physicianBookings);
app.use("/api/physicianPrescription", physicianPrescription);
app.use("/api/physiciansBank", physicianBank);

// opds
app.use("/api/opdRoutes", opds);

// pathLabs
app.use("/api/pathLabs", pathLabs);

//search
app.use("/api/search", webSearch);

/*****************************************************************************************************/

// images for websearch by users
app.use("/api/webSearch/files/images", express.static("files/images"));

//images for users app
app.use("/api/files/images", verifyUser, express.static("files/images"));

//images for doctors app
app.use(
  "/api/doctors/files/images",
  doctorsSignin,
  express.static("files/images")
);

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
