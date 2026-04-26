const express = require("express");
const {
  completeJobAndRate,
  createProposal,
  getProposalsByJob,
  updateProposalStatus
} = require("../controllers/proposalController");
const { authorizeRoles, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("freelancer"), createProposal);
router.get("/job/:jobId", protect, getProposalsByJob);
router.patch("/:id/status", protect, authorizeRoles("client"), updateProposalStatus);
router.post("/complete", protect, authorizeRoles("client"), completeJobAndRate);

module.exports = router;
