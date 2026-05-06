const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["present", "absent", "late"],
  },
  marked_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attendance", attendanceSchema);