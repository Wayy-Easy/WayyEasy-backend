import PhysicianBooking from "../../models/bookings/physicianBookings.js";
import UserModel from "../../models/userModels/userModel.js";
import PhysiciansModel from "../../models/PhysiciansModels/Physicians.js";

//by user
//to book user
export const bookPhysician = async (req, res) => {
  try {
    const data = {
      userId: req.user._id,
      physicianId: req.params.physicianId,
    };

    const bookingData = await PhysicianBooking.create(data);
    res.send(bookingData);
  } catch (error) {
    console.log("Error: 5 ", error);
  }
};

//by user
//to finish consultation
export const finishConsultation = async (req, res) => {
  try {
    const finishedBooking = await PhysicianBooking.findOneAndUpdate(
      {
        $and: [
          { userId: req.user._id },
          { physicianId: req.params.physicianId },
        ],
      },
      { consultation: "finished" },
      { new: true }
    );

    res.send(finishedBooking);
  } catch (error) {
    res.send({ message: error.message });
  }
};

//by user
//fetch all booking who are finished and who are pending
export const fetchPhysiciansByUser = async (req, res) => {
  const { dataType = null } = req.params;
  try {
    let result = [];
    if (dataType?.length > 5) {
      if (dataType === "pending") {
        result = await PhysicianBooking.find({
          $and: [{ userId: req.user._id }, { consultation: "pending" }],
        });
      } else if (dataType === "finished") {
        result = await PhysicianBooking.find({
          $and: [{ userId: req.user._id }, { consultation: "finished" }],
        });
      }

      result = result?.map((user) => user.physicianId);

      result = await PhysiciansModel.find({ _id: { $in: result } });

      if (result?.length > 0) {
        res.send({ data: result });
      } else {
        res.send({ message: "No data found" });
      }
    } else {
      res.send({ message: "Invalid request type." });
    }
  } catch (error) {
    res.send({ message: error.message });
  }
};

//by user
//fetch physician to check whether consultartion pending or not
export const fetchSinglePhysicianConsultationPendingByUser = async (
  req,
  res
) => {
  try {
    const result = await PhysicianBooking.find({
      $and: [
        {
          userId: req.user._id,
        },
        { physicianId: req.params.physicianId },
        { consultation: "pending" },
      ],
    });

    if (result[0]) {
      res.send(result[0]);
    } else res.send({ message: "No booking found with this doctor" });
  } catch (error) {
    res.send({ message: error.message });
  }
};

//by physicians
//to get all bookings
export const fetchAllBookingsByPhysician = async (req, res) => {
  try {
    let result = await PhysicianBooking.find({
      $and: [
        {
          physicianId: req.user._id,
        },
        { consultation: "pending" },
      ],
    });

    result = result?.map((user) => user.userId);

    result = await UserModel.find({ _id: { $in: result } });
    res.send({ data: result });
  } catch (error) {
    res.send({ message: error.message });
  }
};
