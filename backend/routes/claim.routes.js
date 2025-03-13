const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const Coupon = require("../models/coupon.model");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", authMiddleware.authUser, async (req, res, next) => {
  const userIp = req.ip;
  const recentClaim = await Coupon.findOne({
    claimedBy: userIp,
    claimedAt: { $gt: new Date(Date.now() - 3600000) },
  });

  if (recentClaim) {
    const timeDiff = Date.now() - recentClaim.claimedAt;
    const timeLeft = 3600000 - timeDiff;
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    const time = `${minutes}m ${seconds}s`;
    return res.status(429).json({
      message: `You have already claimed a coupon. Please try again after : `,
      min: minutes,
      sec: seconds,
    });
  }

  const nextCoupon = await Coupon.findOne({ claimedBy: null });

  if (!nextCoupon) {
    return res
      .status(404)
      .json({ message: "No coupons available at the moment." });
  }

  nextCoupon.claimedBy = userIp;
  nextCoupon.claimedAt = new Date();
  await nextCoupon.save();

  const token = jwt.sign({ _id: userIp }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 3600000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });

  res.status(201).json({
    message: "Coupon claimed successfully!",
    coupon: nextCoupon.code,
  });
});

router.post("/add-coupons", async (req, res) => {
  try {
    const coupons = [];
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "");

    for (let i = 999; i <= 1199; i++) {
      coupons.push({ code: `COUPON${dateStr}${timeStr}${i}` });
    }

    // Insert coupons into the database
    await Coupon.insertMany(coupons);

    res.json({ message: "20 coupons added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding coupons", error: error.message });
  }
});

module.exports = router;
