const Job = require("../models/Job");
const Proposal = require("../models/Proposal");
const User = require("../models/User");

// Return the signed-in user's full profile data for the profile page.
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("postedJobs")
      .populate("bookmarkedJobs")
      .populate("acceptedJobs");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// Keep profile edits scoped to the fields exposed in the UI.
const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = {
      name: req.body.name,
      bio: req.body.bio,
      skills: req.body.skills || [],
      portfolioLinks: req.body.portfolioLinks || [],
      experienceLevel: req.body.experienceLevel,
      hourlyRate: req.body.hourlyRate,
      profilePicture: req.body.profilePicture,
      companyName: req.body.companyName,
      companyDescription: req.body.companyDescription
    };

    const user = await User.findByIdAndUpdate(req.user._id, allowedUpdates, {
      new: true,
      runValidators: true
    }).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

// Each role gets its own dashboard payload to keep the frontend simple.
const getDashboardData = async (req, res) => {
  try {
    if (req.user.role === "freelancer") {
      const proposals = await Proposal.find({ freelancer: req.user._id })
        .populate("job", "title budget nicheCategory status")
        .sort({ createdAt: -1 });

      const recommendations = await Job.find({
        requiredSkills: { $in: req.user.skills || [] },
        status: "open"
      })
        .limit(5)
        .populate("client", "name companyName");

      return res.json({
        role: "freelancer",
        proposals,
        acceptedJobs: await Job.find({ hiredFreelancer: req.user._id }).populate("client", "name companyName"),
        recommendations
      });
    }

    const jobs = await Job.find({ client: req.user._id }).sort({ createdAt: -1 });
    const applicants = await Proposal.find({ client: req.user._id })
      .populate("freelancer", "name skills hourlyRate averageRating")
      .populate("job", "title nicheCategory status");

    res.json({
      role: "client",
      jobs,
      applicants
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard", error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboardData
};
