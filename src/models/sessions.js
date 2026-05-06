const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  batch_id: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
  trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  date: String,
  start_time: String,
  end_time: String,
}, { timestamps: { createdAt: "created_at", updatedAt: false } });

module.exports = mongoose.model("Session", sessionSchema);