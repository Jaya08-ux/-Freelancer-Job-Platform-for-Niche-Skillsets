const Job = require("../models/Job");
const Proposal = require("../models/Proposal");
const User = require("../models/User");

// Clients create specialized jobs that freelancers can discover and bid on.
const createJob = async (req, res) => {
  try {
    const { title, description, budget, nicheCategory, requiredSkills } = req.body;

    const job = await Job.create({
      title,
      description,
      budget,
      nicheCategory,
      requiredSkills: requiredSkills || [],
      client: req.user._id
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { postedJobs: job._id }
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Job creation failed", error: error.message });
  }
};

// Public job feed with search and niche filtering.
const getJobs = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (category) {
      filter.nicheCategory = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { requiredSkills: { $elemMatch: { $regex: search, $options: "i" } } }
      ];
    }

    const jobs = await Job.find(filter)
      .populate("client", "name companyName")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
};

// Single job view with the connected client and proposal details.
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("client", "name companyName companyDescription")
      .populate("hiredFreelancer", "name skills hourlyRate averageRating");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const proposals = await Proposal.find({ job: job._id })
      .populate("freelancer", "name skills experienceLevel hourlyRate averageRating")
      .sort({ createdAt: -1 });

    res.json({ ...job.toObject(), proposals });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch job", error: error.message });
  }
};

// Client-side applicant feed for dashboard review.
const getClientApplicants = async (req, res) => {
  try {
    const proposals = await Proposal.find({ client: req.user._id })
      .populate("job", "title nicheCategory status budget")
      .populate("freelancer", "name skills hourlyRate experienceLevel averageRating")
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applicants", error: error.message });
  }
};

// Freelancers can save interesting roles for later review.
const bookmarkJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.id;
    const isBookmarked = user.bookmarkedJobs.some((id) => id.toString() === jobId);

    if (isBookmarked) {
      user.bookmarkedJobs = user.bookmarkedJobs.filter((id) => id.toString() !== jobId);
    } else {
      user.bookmarkedJobs.push(jobId);
    }

    await user.save();
    res.json({
      message: isBookmarked ? "Bookmark removed" : "Job bookmarked",
      bookmarkedJobs: user.bookmarkedJobs
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update bookmark", error: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  getClientApplicants,
  bookmarkJob
};
