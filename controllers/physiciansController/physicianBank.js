import PhysiciansBank from "../../models/PhysiciansModels/PhysiciansBank.js";

export const addBank = async (req, res) => {
  try {
    let bank = { ...req.body, physicianId: req.user._id };
    bank = await PhysiciansBank.create(bank);
    res.send(bank);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const getBankDetailsByPhysician = async (req, res) => {
  try {
    const data = await PhysiciansBank.findOne({
      physicianId: req.body.physicianId,
    });
    res.send(data);
  } catch (error) {
    res.json({ message: error.message });
  }
};
