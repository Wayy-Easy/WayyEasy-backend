import AdminPayments from "../../models/admin/adminPayments.js";

export const addPayment = async (req, res) => {
  try {
    if (req.user.role === "user") {
      const payments = await AdminPayments.create(req.body);
      res.send(payments);
    } else res.json({ message: "Only users are allowed to add payment" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const getPaymentLsit = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const data = await AdminPayments.find({ paymentStatus: "Pending" });
      res.send(data);
    } else res.json({ message: "Only admin is allowed to access this" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const getPaymentFullDetails = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const data = await AdminPayments.findById(req.body.id).populate({
        path: "physicianId",
        select: ["name", "image", "mobile", "price"],
      });
      res.send(data);
    } else res.json({ message: "Only admin is allowed to access this" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const finishPayment = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const data = await AdminPayments.findByIdAndUpdate(
        req.body.id,
        { paymentStatus: "Paid" },
        { new: true }
      );
      res.send(data);
    } else res.json({ message: "Only admin is allowed to access this" });
  } catch (error) {
    res.json({ message: error.message });
  }
};
