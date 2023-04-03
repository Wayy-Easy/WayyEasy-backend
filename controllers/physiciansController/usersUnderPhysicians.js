import usersUnderPhysicians from "../../models/PhysiciansModels/usersUnderPhysicians.js";
import userModel from "../../models/userModels/physiciansUnderUsers.js";
import Physicians from "../../models/PhysiciansModels/Physicians.js";
import physiciansUnderUsers from "../../models/userModels/physiciansUnderUsers.js";
import User from "../../models/userModels/userModel.js";

export const fetchUsersBookedPhysician = async (req, res) => {
  try {
    const usersUnderPhysician = await usersUnderPhysicians.find({
      doctorId: req.user._id,
    });

    let userList = usersUnderPhysician[0].userList.filter(
      (user) => user?.consultation === "pending"
    );

    if (userList && userList?.length) {
      res.json({
        result: "success",
        data: Object.assign(userList),
      });
    } else {
      res.json({
        result: "failure",
      });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const createUsersBookedPhysician = async (req, res) => {
  const { physicianId } = req.params;

  try {
    let existingPatient, physicianData, existingPhysician;

    existingPatient = await usersUnderPhysicians.findOne(
      { doctorId: physicianId },
      {
        userList: {
          $elemMatch: {
            userId: req?.user?._id,
            consultation: "pending",
          },
        },
      }
    );

    existingPhysician = await physiciansUnderUsers.findOne(
      { userId: req?.user?._id },
      {
        physiciansList: {
          $elemMatch: {
            physicianId,
            consultation: "pending",
          },
        },
      }
    );

    physicianData = await Physicians.findById(physicianId);

    if (existingPatient) {
      await usersUnderPhysicians.updateOne(
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
      await usersUnderPhysicians.create({
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

    if (existingPhysician) {
      await userModel.updateOne(
        { userId: req?.user?._id },
        {
          $push: {
            physiciansList: [
              {
                physicianId: physicianId,
                physicianName: req?.body?.physicianName,
                consultation: req?.body?.consultation,
                amountPaid: req?.body?.amountPaid,
                workingDays: req?.body?.workingDays,
                profileImage: physicianData?.image,
                specialityType: req?.body?.specialityType,
                fcmToken: physicianData?.fcmToken,
              },
            ],
          },
        }
      );
    } else {
      await userModel.create({
        userId: req?.user?._id,
        physiciansList: [
          {
            physicianId: physicianId,
            physicianName: req?.body?.physicianName,
            consultation: req?.body?.consultation,
            amountPaid: req?.body?.amountPaid,
            workingDays: req?.body?.workingDays,
            profileImage: physicianData?.image,
            specialityType: req?.body?.specialityType,
            fcmToken: physicianData?.fcmToken,
          },
        ],
      });
    }

    await Physicians.findByIdAndUpdate(physicianId, {
      $push: {
        userLists: [
          {
            userId: req?.user?._id,
          },
        ],
      },
    });

    await User.findByIdAndUpdate(req?.user?._id, {
      $push: {
        physicianLists: [
          {
            physicianId,
          },
        ],
      },
    });

    res.json({
      result: "success",
      message: "Booking confirmed",
    });
  } catch (error) {
    console.error(error);
    res.json({ message: error.message });
  }
};

export const addUserPrescription = async (req, res) => {
  const { userId } = req.params;

  try {
    await userModel.updateOne(
      { userId },
      {
        $set: {
          "physiciansList.$[i].prescription": req?.body,
        },
      },
      {
        arrayFilters: [{ "i.physicianId": req?.user?._id }],
      }
    );

    res.status(201).send({ message: "Prescription updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ message: error.message });
  }
};

export const finishConsultancyByDoctor = async (req, res) => {
  const { userId = "" } = req.params;
  try {
    await usersUnderPhysicians.updateOne(
      {
        doctorId: req.user._id,
      },
      {
        $set: {
          "userList.$[i].consultation": "finished",
        },
      },
      {
        arrayFilters: [{ "i.userId": userId }],
      }
    );

    await Physicians.update(
      { _id: req.user._id },
      {
        $pull: {
          userLists: { userId: userId },
        },
      }
    );

    res.status(200).json({ message: "Data updated Successfully." });
  } catch (error) {
    res.json({ message: error.message });
  }
};
