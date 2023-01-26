import Model from "../../models/pathLabModels/pathLab.js";

export const createPathLab = async (req, res) => {
  const data = req.body;
  try {
    const newData = {
      ...data,
      owner: req.user._id,
    };
    const newPathLab = await Model.create(newData);
    res.status(201).send(newPathLab);
  } catch (error) {
    res.status(422).json({ error: error.message });
    console.log(error);
  }
};

export const fetchSinglePathLab = async (req, res) => {
  const { id } = req.params;
  try {
    const singlePathLab = await Model.findById(id);
    res.status(200).send({
      success: true,
      data: singlePathLab,
    });
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const fetchAllPathLabs = async (req, res) => {
  try {
    let pathLabs = await Model.find();
    res.status(200).send(pathLabs);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const editPathLab = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedPathLab = await Model.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(202).send(updatedPathLab);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const deletePathLab = async (req, res) => {
  const { id } = req.params;
  try {
    return await Model.findByIdAndDelete(id);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};
