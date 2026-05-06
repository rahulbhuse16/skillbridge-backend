const attendance = require("../models/Attendance");
const sessions = require("../models/sessions");



exports.createSession = async (req, res) => {
  if (req.user.role !== "trainer") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const session = await sessions.create({
    batch_id: req.body.batch_id,
    trainer_id: req.user._id,
    title: req.body.title,
    date: req.body.date,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
  });

  res.json(session);
};


exports.getSessionAttendance = async (req, res) => {
  try {
    if (req.user.role !== "trainer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const sessionId = req.params.id;

    const attendance = await attendance.find({ session_id: sessionId })
      .populate("student_id", "name clerk_user_id");

    res.status(200).json({
      session_id: sessionId,
      total_students: attendance.length,
      data: attendance,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching attendance",
      error: err.message,
    });
  }
};