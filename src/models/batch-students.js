const mongoose = require("mongoose");

const batchStudentSchema = new mongoose.Schema({
  batch_id: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("BatchStudent", batchStudentSchema);