import Model from "../../models/hospitalModels/hospitalModel.js";
import User from "../../models/auth/ownerModel.js";
import Ratings from "../../models/hospitalModels/retingsModel.js";

export const createHospital = async (req, res) => {
  const data = req.body;
  try {
    const newData = {
      ...data,
      owner: req.user._id,
    };
    const newHospital = await Model.create(newData);
    res.status(201).send(newHospital);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const viewAllHospital = async (req, res) => {
  let { name, value, limit, page } = req.query;
  limit = limit || 3;
  page = page || 1;

  let startIndex = (Number(page) - 1) * limit; // get the starting index of every page
  try {
    let filterHospitals;
    // Nearby
    if (name == "pincode") {
      filterHospitals = await Model.find({ pincode: value });
    }
    // Top
    if (name == "top") {
      let ratingsData = await Ratings.aggregate([
        {
          $group: {
            _id: "$hospital",
            Rating: {
              $avg: "$average",
            },
            Users: {
              $sum: 1,
            },
          },
        },
        {
          $match: {
            Rating: {
              $gte: parseInt(value),
            },
          },
        },
      ]);

      let filteredRatings = ratingsData?.map((rat) => rat._id);

      filterHospitals = await Model.find({
        _id: filteredRatings,
      })
        .limit(limit)
        .skip(startIndex);
    }
    // Value for money
    if (name == "valueForMoney") {
      let ratingsData = await Ratings.aggregate([
        {
          $group: {
            _id: "$hospital",
            Rating: {
              $avg: "$valueForMoney",
            },
            Users: {
              $sum: 1,
            },
          },
        },
        {
          $match: {
            Rating: {
              $gte: parseInt(value),
            },
          },
        },
      ]);

      let filteredRatings = ratingsData?.map((rat) => rat._id);
      filterHospitals = await Model.find({
        _id: filteredRatings,
      })
        .limit(limit)
        .skip(startIndex);
    }
    // Location
    if (name == "location") {
      let ratingsData = await Ratings.aggregate([
        {
          $group: {
            _id: "$hospital",
            Rating: {
              $avg: "$location",
            },
            Users: {
              $sum: 1,
            },
          },
        },
        {
          $match: {
            Rating: {
              $gte: parseInt(value),
            },
          },
        },
      ]);

      let filteredRatings = ratingsData?.map((rat) => rat._id);

      filterHospitals = await Model.find({
        _id: filteredRatings,
      })
        .limit(limit)
        .skip(startIndex);
    }
    // Treatment
    if (name == "treatment") {
      let ratingsData = await Ratings.aggregate([
        {
          $group: {
            _id: "$hospital",
            Rating: {
              $avg: "$treatement",
            },
            Users: {
              $sum: 1,
            },
          },
        },
        {
          $match: {
            Rating: {
              $gte: parseInt(value),
            },
          },
        },
      ]);

      let filteredRatings = ratingsData?.map((rat) => rat._id);

      filterHospitals = await Model.find({
        _id: filteredRatings,
      })
        .limit(limit)
        .skip(startIndex);
    }
    // staffs
    if (name == "staffs") {
      let ratingsData = await Ratings.aggregate([
        {
          $group: {
            _id: "$hospital",
            Rating: {
              $avg: "$staffs",
            },
            Users: {
              $sum: 1,
            },
          },
        },
        {
          $match: {
            Rating: {
              $gte: parseInt(value),
            },
          },
        },
      ]);

      let filteredRatings = ratingsData?.map((rat) => rat._id);

      filterHospitals = await Model.find({
        _id: filteredRatings,
      })
        .limit(limit)
        .skip(startIndex);
    }
    // search all hospital
    if (name == "getAll") {
      if (limit < 11) {
        limit = 11;
      }
      startIndex = (Number(page) - 1) * limit; // get the starting index of every page
      // const total = await Model.countDocuments({});
      // const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
      // res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
      filterHospitals = await Model.find().limit(limit).skip(startIndex);
    }
    res.status(200).send(filterHospitals);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const viewHospital = async (req, res) => {
  try {
    if (req?.user?.role === "owner") {
      const allHospitals = await Model.find({ owner: req.user._id });
      res.status(200).send({
        success: true,
        data: allHospitals,
      });
    }
    if (req?.user?.role === "admin") {
      const allHospitals = await Model.find();
      res.status(200).send({
        success: true,
        data: allHospitals,
      });
    }
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const fetchSingleHospital = async (req, res) => {
  const { id } = req.params;
  try {
    const singleHospitals = await Model.findById(id);
    res.status(200).send({
      success: true,
      data: singleHospitals,
    });
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const editHospital = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedHospital = await Model.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(202).send(updatedHospital);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

export const deleteHospital = async (req, res) => {
  const { id } = req.params;
  try {
    await Model.findByIdAndDelete(id);
    res.status(202).send({ message: "Successfully deleted" });
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};
