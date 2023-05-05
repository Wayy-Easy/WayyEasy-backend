import PhysicianPrescription from "../../models/bookings/physicianPrescription.js";
import PhysicianBookingModel from "../../models/bookings/physicianBookings.js";

//by doctor
//to create new prescription
export const addPrescription = async (req, res) => {
  try {
    const result = await PhysicianBookingModel.find({
      $and: [
        {
          physicianId: req.user._id,
        },
        { userId: req.params.userId },
        { consultation: "pending" },
      ],
    });

    if (result) {
      if (result[0]) {
        const data = {
          physicianId: req.user._id,
          userId: req.params.userId,
          consultationId: result[0]._id,
          prescription: req.body,
        };

        const createdData = await PhysicianPrescription.create(data);
        res.send(createdData);
      } else {
        res.send({
          message:
            "Booking data for this doctor is not available. Please contact our support team. Error code: PH-301",
        });
      }
    } else {
      res.send({
        message:
          "Booking data for this doctor is not available. Please contact our support team. Error code: PH-301",
      });
    }
  } catch (error) {
    res.send({ message: error.message });
  }
};

//by doctor
//to get their own prescriptions
export const getPrescriptionByPhysician = async (req, res) => {
  try {
    const result = await PhysicianBookingModel.find({
      $and: [
        {
          physicianId: req.user._id,
        },
        { userId: req.params.userId },
        { consultation: "pending" },
      ],
    });

    const data = await PhysicianPrescription.findOne({
      consultationId: result[0]._id,
    });
    res.send(data);
  } catch (error) {
    res.send({ message: error.message });
  }
};

//by doctor
//to get their own prescriptions
export const getPrescriptionByUser = async (req, res) => {
  try {
    const result = await PhysicianBookingModel.find({
      $and: [
        {
          userId: req.user._id,
        },
        { physicianId: req.params.physicianId },
        { consultation: "pending" },
      ],
    });

    if (result[0]) {
      const data = await PhysicianPrescription.findOne({
        consultationId: result[0]._id,
      });
      res.send(data);
    } else {
      res.send({ message: "No prescription found" });
    }
  } catch (error) {
    res.send({ message: error.message });
  }
};

//by doctor
//to edit his/her prescription given to users
export const updatePrescription = async (req, res) => {
  try {
    const result = await PhysicianBookingModel.find({
      $and: [
        {
          physicianId: req.user._id,
        },
        { userId: req.params.userId },
        { consultation: "pending" },
      ],
    });

    const data = {
      physicianId: req.user._id,
      userId: req.params.userId,
      consultationId: result[0]._id,
      prescription: req.body,
    };

    const updatedData = await PhysicianPrescription.findOneAndUpdate(
      {
        consultationId: result[0]._id,
      },
      data,
      {
        new: true,
      }
    );

    res.send(updatedData);
  } catch (error) {
    res.send({ message: error.message });
  }
};
