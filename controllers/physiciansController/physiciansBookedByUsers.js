import Model from "../../models/PhysiciansModels/usersBookedPhysician.js";
import userModel from "../../models/userModel.js";
import Physicians from "../../models/PhysiciansModels/Physicians.js";

export const fetchUsersBookedPhysician = async (req, res) => {
  const { physicianId } = req.params;

  try {
    const usersBookedPhysician = await Model.findOne({ doctorId: physicianId });

    if (usersBookedPhysician?.userList) {
      res.json(Object.assign(usersBookedPhysician?.userList));
    } else {
      res.json(usersBookedPhysician);
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const createUsersBookedPhysician = async (req, res) => {
  const { physicianId } = req.params;

  try {
    let existingData, userAlreadyBooked, physicianData;
    existingData = await Model.findOne({ doctorId: physicianId });

    userAlreadyBooked = existingData?.userList?.find((user) => {
      return user?.userId.valueOf() === req?.user?._id;
    });

    if (userAlreadyBooked) {
      return res.json({
        result: "failed",
        message: "Already booked",
      });
    }

    physicianData = await Physicians.findById(physicianId);

    if (existingData) {
      await Model.updateOne(
        { doctorId: physicianId },
        {
          $push: {
            userList: [
              {
                userId: req?.user?._id,
                name: req?.body?.name,
                age: req?.body?.age,
                profileImage: req.body?.profileImage,
                consultation: req?.body?.consultation,
                amountPaid: req?.body?.amountPaid,
                fcmToken: req?.body?.fcmToken,
              },
            ],
          },
        }
      );
    } else {
      await Model.create({
        doctorId: physicianId,
        userList: [
          {
            userId: req?.user?._id,
            name: req?.body?.name,
            age: req?.body?.age,
            consultation: req?.body?.consultation,
            profileImage: req.body?.profileImage,
            amountPaid: req?.body?.amountPaid,
            fcmToken: req?.body?.fcmToken,
          },
        ],
      });
    }

    await userModel.updateOne(
      { _id: req?.user?._id },
      {
        $push: {
          physiciansBooked: [
            {
              physicianId: physicianId,
              physicianName: req?.body?.physicianName,
              consultation: req?.body?.consultation,
              amountPaid: req?.body?.amountPaid,
              profileImage: physicianData?.image,
              specialityType: req?.body?.specialityType,
              fcmToken: physicianData?.fcmToken,
            },
          ],
        },
      }
    );

    console.log(physicianData?.image);
    console.log(req.body?.profileImage);

    res.json({
      result: "success",
      message: "Booking confirmed",
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const addUserPrescription = async (req, res) => {
  const { userId } = req.params;

  try {
    await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          "physiciansBooked.$[i].prescription": req.body,
        },
      },
      {
        arrayFilters: [{ "i.physicianId": req?.user?._id }],
      }
    );
    res.status(201).send({ message: "Prescription updated successfully" });
  } catch (error) {
    res.json({ message: error.message });
  }
};
