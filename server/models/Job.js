const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    budget: {
      type: Number,
      required: true
    },
    nicheCategory: {
      type: String,
      required: true,
      enum: ["AI/ML", "Blockchain", "Cybersecurity", "UI/UX Micro Design", "DevOps", "Technical Writing"]
    },
    requiredSkills: [
      {
        type: String,
        trim: true
      }
    ],
    status: {
      type: String,
      enum: ["open", "in_progress", "completed"],
      default: "open"
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    hiredFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
