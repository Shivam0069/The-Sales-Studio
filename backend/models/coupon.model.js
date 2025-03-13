const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  claimedBy: {
    type: String,
    default: null,
  },
  claimedAt: {
    type: Date,
    default: null,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
