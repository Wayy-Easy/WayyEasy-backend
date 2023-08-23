import PhysicianModel from "../../models/PhysiciansModels/Physicians.js";

export const getDatainWebSearch = async (req, res) => {
  try {
    switch (req.query.searchType) {
      case "physician":
        let data = null;
        if (
          req.query.name?.length > 0 &&
          req.query.addressAndSpeciality?.length > 0
        ) {
          data = await PhysicianModel.find({
            $and: [
              { name: { $regex: req.query.name, $options: "i" } },
              {
                specialityType: {
                  $regex: req.query.addressAndSpeciality,
                  $options: "i",
                },
              },
              { status: "active" },
            ],
          });
        } else if (req.query.name?.length > 0) {
          data = await PhysicianModel.find({
            $and: [
              { name: { $regex: req.query.name, $options: "i" } },
              { status: "active" },
            ],
          });
        } else if (req.query.addressAndSpeciality?.length > 0) {
          data = await PhysicianModel.find({
            $and: [
              {
                specialityType: {
                  $regex: req.query.addressAndSpeciality,
                  $options: "i",
                },
              },
              { status: "active" },
            ],
          });
        } else {
          data = await PhysicianModel.find({
            status: "active",
          });
        }
        res.status(200).send(data);
        break;
      case "hospital":
        break;
      case "opd":
        break;
      case "pathLab":
        break;

      default:
        break;
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
