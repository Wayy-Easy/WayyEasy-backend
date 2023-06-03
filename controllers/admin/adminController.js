import AdminPayments from "../../models/admin/adminPayments.js";

export const addPayment = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const payments = await AdminPayments.create(req.body);
      res.send(payments);
    } else res.json({ message: "Only admin is allowed to access this" });
  } catch (error) {
    res.json({ message: error.message });
  }
};
