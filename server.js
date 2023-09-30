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
  res.send("Welcome to the Wayyeasy-server.");
});

//admin
app.use("/admin/payment", paymentRoutes);
app.use("/admin/articles", articleRoutes);

//hospital
app.use("/doctor", doctorRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/owner", ownerRoutes);
app.use("/ratings", ratingRoutes);
app.use("/room", roomRoutes);

//user
app.use("/user", userRoutes);

// physicians
app.use("/physicians", physicians);
app.use("/physicianBookings", physicianBookings);
app.use("/physicianPrescription", physicianPrescription);
app.use("/physiciansBank", physicianBank);

// opds
app.use("/opdRoutes", opds);

// pathLabs
app.use("/pathLabs", pathLabs);

//search
app.use("/search", webSearch);

/*****************************************************************************************************/

// images for websearch by users
app.use("/webSearch/files/images", express.static("files/images"));

//images for users app
app.use("/files/images", verifyUser, express.static("files/images"));

//images for doctors app
app.use("/doctors/files/images", doctorsSignin, express.static("files/images"));

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
