const express = require("express");
const {
  createJob,
  getJobs,
  getJobById,
  getClientApplicants,
  bookmarkJob
} = require("../controllers/jobController");
const { authorizeRoles, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getJobs);
router.get("/applicants", protect, authorizeRoles("client"), getClientApplicants);
router.get("/:id", getJobById);
router.post("/", protect, authorizeRoles("client"), createJob);
router.post("/:id/bookmark", protect, authorizeRoles("freelancer"), bookmarkJob);

module.exports = router;
