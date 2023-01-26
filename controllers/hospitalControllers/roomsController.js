import Model from "../../models/hospitalModels/roomsModel.js";

export const createRoom = async (req, res) => {
  const data = req.body;
  try {
    const newData = {
      ...data,
      owner: req.user._id,
    };

    const newRoom = await Model.create(newData);
    return res.status(201).send(newRoom);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const viewRoom = async (req, res) => {
  try {
    if (req?.user?.role === "owner") {
      const allRooms = await Model.find({ owner: req.user._id });
      res.status(200).send({
        success: true,
        data: allRooms,
      });
    }
    if (req?.user?.role === "admin") {
      const allRooms = await Model.find();
      res.status(200).send({
        success: true,
        data: allRooms,
      });
    }
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const fetchSingleRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const singleRoom = await Model.findById(id);
    res.status(200).send({
      success: true,
      data: singleRoom,
    });
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const editRoom = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  let updatedRoom;

  switch (req.query.type) {
    case "pending":
      try {
        updatedRoom = await Model.findByIdAndUpdate(
          id,
          {
            $set: {
              "rooms.roomDetails.$[i].available": "pending",
            },
          },
          {
            arrayFilters: [{ "i._id": data.roomDetailsId }],
          }
        );
        res.status(202).send(updatedRoom);
      } catch (error) {
        res.status(422).json({ error: error.message });
      }
      break;
    case "hold":
      try {
        updatedRoom = await Model.findByIdAndUpdate(
          id,
          {
            $set: {
              "rooms.roomDetails.$[i].available": "hold",
            },
          },
          {
            arrayFilters: [{ "i._id": data.roomDetailsId }],
          }
        );
        res.status(202).send(updatedRoom);
      } catch (error) {
        res.status(422).json({ error: error.message });
      }
      break;
    case "booked":
      try {
        updatedRoom = await Model.findByIdAndUpdate(
          id,
          {
            $push: {
              "rooms.roomDetails.$[i].user": data.user,
            },
            $set: {
              "rooms.roomDetails.$[i].available": "no",
            },
          },
          {
            arrayFilters: [{ "i._id": data.roomDetailsId }],
          }
        );
        res.status(202).send(updatedRoom);
      } catch (error) {
        res.status(422).json({ error: error.message });
      }
      break;
    case "discharge":
      try {
        updatedRoom = await Model.findByIdAndUpdate(
          id,
          {
            $set: {
              "rooms.roomDetails.$[i].user.$[j].status": "discharge",
              "rooms.roomDetails.$[i].user.$[j].amountPaid": data.amount,
              "rooms.roomDetails.$[i].user.$[j].releaseDate": new Date(),
              "rooms.roomDetails.$[i].available": "yes",
            },
          },
          {
            arrayFilters: [
              { "i._id": data.roomDetailsId },
              { "j._id": data.userId },
            ],
          }
        );
        res.status(202).send(updatedRoom);
      } catch (error) {
        res.status(422).json({ error: error.message });
      }
      break;
    case "close":
      try {
        updatedRoom = await Model.findByIdAndUpdate(
          id,
          {
            $set: {
              "rooms.roomDetails.$[i].user.$[j].status": "close",
              "rooms.roomDetails.$[i].user.$[j].hospitalPiad": data.amount,
            },
          },
          {
            arrayFilters: [
              { "i._id": data.roomDetailsId },
              { "j._id": data.userId },
            ],
          }
        );
        res.status(202).send(updatedRoom);
      } catch (error) {
        res.status(422).json({ error: error.message });
      }
      break;
    default:
      try {
        updatedRoom = await Model.findByIdAndUpdate(id, data, { new: true });
        res.status(202).send(updatedRoom);
      } catch (error) {
        res.status(422).json({ error: error.message });
      }
  }
};

export const deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    await Model.findByIdAndDelete(id);
    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

//app

export const fetchRoomsByHospitals = async (req, res) => {
  const { hospitalId } = req.params;
  try {
    const filteredRooms = await Model.find({ hospital: hospitalId });
    res.status(200).send(filteredRooms);
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: error.message });
  }
};
