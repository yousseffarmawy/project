const mongoose = require("mongoose");

const application = new mongoose.schema({
  job: {
    type: mongoose.schema.Types.ObjectId,
    ref: "Job",

    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cv: {
    type: String,
    required: true,
  },
});
