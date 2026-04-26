const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job"
    }
  },
  { _id: false, timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["freelancer", "client"],
      required: true
    },
    bio: {
      type: String,
      trim: true,
      default: ""
    },
    skills: [
      {
        type: String,
        trim: true
      }
    ],
    portfolioLinks: [
      {
        type: String,
        trim: true
      }
    ],
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert"],
      default: "Intermediate"
    },
    hourlyRate: {
      type: Number,
      default: 0
    },
    profilePicture: {
      type: String,
      default: ""
    },
    companyName: {
      type: String,
      trim: true,
      default: ""
    },
    companyDescription: {
      type: String,
      trim: true,
      default: ""
    },
    postedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }
    ],
    bookmarkedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }
    ],
    acceptedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }
    ],
    ratings: [ratingSchema]
  },
  { timestamps: true }
);

userSchema.virtual("averageRating").get(function averageRating() {
  if (!this.ratings.length) {
    return 0;
  }

  const total = this.ratings.reduce((sum, rating) => sum + rating.score, 0);
  return Number((total / this.ratings.length).toFixed(1));
});

userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
