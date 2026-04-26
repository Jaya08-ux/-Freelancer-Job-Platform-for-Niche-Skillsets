const Job = require("../models/Job");
const Proposal = require("../models/Proposal");
const User = require("../models/User");

// A freelancer submits one proposal per job with a custom pitch and bid.
const createProposal = async (req, res) => {
  try {
    const { jobId, proposalText, bidAmount } = req.body;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const proposal = await Proposal.create({
      job: job._id,
      freelancer: req.user._id,
      client: job.client,
      proposalText,
      bidAmount
    });

    res.status(201).json(proposal);
  } catch (error) {
    const status = error.code === 11000 ? 400 : 500;
    res.status(status).json({
      message: error.code === 11000 ? "You already applied to this job" : "Proposal submission failed",
      error: error.message
    });
  }
};

// Fetch every proposal connected to a specific job.
const getProposalsByJob = async (req, res) => {
  try {
    const proposals = await Proposal.find({ job: req.params.jobId })
      .populate("freelancer", "name skills hourlyRate experienceLevel averageRating")
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch proposals", error: error.message });
  }
};

// Clients accept or reject proposals and trigger the hiring workflow.
const updateProposalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const proposal = await Proposal.findById(req.params.id).populate("job");

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    if (proposal.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to change this proposal" });
    }

    proposal.status = status;
    await proposal.save();

    if (status === "accepted") {
      await Proposal.updateMany(
        { job: proposal.job._id, _id: { $ne: proposal._id } },
        { status: "rejected" }
      );

      await Job.findByIdAndUpdate(proposal.job._id, {
        status: "in_progress",
        hiredFreelancer: proposal.freelancer
      });

      await User.findByIdAndUpdate(proposal.freelancer, {
        $addToSet: { acceptedJobs: proposal.job._id }
      });
    }

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: "Failed to update proposal", error: error.message });
  }
};

// After delivery, the client marks the job complete and leaves a rating.
const completeJobAndRate = async (req, res) => {
  try {
    const { proposalId, score, comment } = req.body;
    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    if (proposal.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to rate this freelancer" });
    }

    await Job.findByIdAndUpdate(proposal.job, { status: "completed" });
    await User.findByIdAndUpdate(proposal.freelancer, {
      $push: {
        ratings: {
          score,
          comment,
          client: req.user._id,
          job: proposal.job
        }
      }
    });

    res.json({ message: "Job completed and freelancer rated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to complete job", error: error.message });
  }
};

module.exports = {
  createProposal,
  getProposalsByJob,
  updateProposalStatus,
  completeJobAndRate
};
