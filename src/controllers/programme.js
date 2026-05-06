const attendance = require("../models/attendance.js");
const batch = require("../models/batch.js");
const sessions = require("../models/sessions.js");


exports.sessionAttendance = async (req, res) => {
  if (req.user.role !== "trainer") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const data = await attendance.find({ session_id: req.params.id })
    .populate("student_id", "name");

  res.json(data);
};

exports.batchSummary = async (req, res) => {
  if (req.user.role !== "institution") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const sessions = await sessions.find({ batch_id: req.params.id });

  const sessionIds = sessions.map(s => s._id);

  const attendance = await Attendance.find({
    session_id: { $in: sessionIds },
  });

  res.json({
    total_sessions: sessions.length,
    total_records: attendance.length,
  });
};

exports.institutionSummary = async (req, res) => {
  if (req.user.role !== "programme_manager") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const batches = await batch.find({ institution_id: req.params.id });

  res.json({
    total_batches: batches.length,
  });
};

exports.programmeSummary = async (req, res) => {
  if (!["programme_manager", "monitoring_officer"].includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const totalAttendance = await attendance.countDocuments();

  res.json({
    total_attendance_records: totalAttendance,
  });
};