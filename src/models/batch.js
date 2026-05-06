const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  institution_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: { createdAt: "created_at", updatedAt: false } });

module.exports = mongoose.model("Batch", batchSchema);