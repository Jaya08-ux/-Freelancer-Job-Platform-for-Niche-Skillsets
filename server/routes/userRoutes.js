const express = require("express");
const {
  getDashboardData,
  getProfile,
  updateProfile
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.get("/dashboard", protect, getDashboardData);

module.exports = router;
