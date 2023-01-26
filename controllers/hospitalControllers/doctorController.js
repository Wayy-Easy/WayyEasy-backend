import Model from "../../models/hospitalModels/doctorModel.js";
import User from "../../models/hospitalModels/ownerModel.js";

export const createDoctor = async (req, res) => {
  const data = req.body;
  try {
    const newData = {
      ...data,
      owner: req.user._id,
    };
    const newDoctor = await Model.create(newData);
    res.status(201).send(newDoctor);
  } catch (error) {
    res.status(422).json({ error: error.message });
    console.log(error);
  }
};

export const fetchSingleDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const singleDoctor = await Model.findById(id);
    res.status(200).send({
      success: true,
      data: singleDoctor,
    });
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const viewDoctor = async (req, res) => {
  try {
    if (req?.user?.role === "owner") {
      const allDoctors = await Model.find({ owner: req.user._id });
      res.status(200).send({
        success: true,
        data: allDoctors,
      });
    }
    if (req?.user?.role === "admin") {
      const allDoctors = await Model.find();
      res.status(200).send({
        success: true,
        data: allDoctors,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: error.message });
  }
};

export const editDoctor = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedDoctor = await Model.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(202).send(updatedDoctor);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    return await Model.findByIdAndDelete(id);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const getDoctorsByHospital = async (req, res) => {
  const { hospitalId } = req.params;
  try {
    const filterdDoctors = await Model.find({ hospital: hospitalId });
    res.status(200).send(filterdDoctors);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};
