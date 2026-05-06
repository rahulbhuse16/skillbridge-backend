const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const attendance = await Attendance.create({
    session_id: req.body.session_id,
    student_id: req.user._id,
    status: req.body.status,
  });

  res.json(attendance);
};