import Model from "../../models/hospitalModels/retingsModel.js";

export const createRating = async (req, res) => {
  const data = req.body;
  try {
    let average =
      (data.staffs +
        data.clean +
        data.treatement +
        data.location +
        data.valueForMoney) /
      5;
    let allRatings = { ...data, average };

    await Model.create(allRatings);
    res.status(201).send({ message: "Thanks for your time." });
  } catch (error) {
    res.status(422).json({ error: error });
  }
};

export const viewRating = async (req, res) => {
  try {
    return await Model.find();
  } catch (error) {
    res.status(422).json({ error: error });
  }
};

export const editRating = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedRating = await Model.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(202).send(updatedRating);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const deleteRating = async (req, res) => {
  const { id } = req.params;
  try {
    return await Model.findByIdAndDelete(id);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

//App

export const getRatingsByHospital = async (req, res) => {
  const { hospitalId } = req.params;
  try {
    const allRatings = await Model.find({ hospital: hospitalId });
    res.status(200).send(allRatings);
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: error.message });
  }
};
