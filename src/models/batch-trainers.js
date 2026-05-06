const mongoose = require("mongoose");

const batchTrainerSchema = new mongoose.Schema({
  batch_id: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
  trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("BatchTrainer", batchTrainerSchema);