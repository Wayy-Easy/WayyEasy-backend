import PhysicianBooking from "../../models/bookings/physicianBookings.js";
import UserModel from "../../models/userModels/userModel.js";

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
//fetch all booking who are finished, pending all physicians list
export const fetchPhysiciansByUser = async (req, res) => {
  const { dataType = null } = req.params;
  try {
    if (dataType === "pending") {
      const result = await PhysicianBooking.find({
        $and: [{ userId: req.user._id }, { consultation: "pending" }],
      });
      res.send(result);
    } else if (dataType === "finished") {
      const result = await PhysicianBooking.find({
        $and: [{ userId: req.user._id }, { consultation: "finished" }],
      });
      res.send(result);
    } else {
      const result = await PhysicianBooking.find();
      res.send(result);
    }
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
