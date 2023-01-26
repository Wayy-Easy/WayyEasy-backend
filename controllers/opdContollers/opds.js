import Model from "../../models/opdModels/opd.js";

export const createOPD = async (req, res) => {
  const data = req.body;
  try {
    const newData = {
      ...data,
      owner: req.user._id,
    };
    const newOPD = await Model.create(newData);
    res.status(201).send(newOPD);
  } catch (error) {
    res.status(422).json({ error: error.message });
    console.log(error);
  }
};

export const fetchSingleOPD = async (req, res) => {
  const { id } = req.params;
  try {
    const singleOPD = await Model.findById(id);
    res.status(200).send({
      success: true,
      data: singleOPD,
    });
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const fetchOPDServices = async (req, res) => {
  try {
    const serviceList = await Model.find();
    res.status(200).send({ serviceList });
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const editOPD = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedOPD = await Model.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(202).send(updatedOPD);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const deleteOPD = async (req, res) => {
  const { id } = req.params;
  try {
    await Model.findByIdAndDelete(id);
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};
