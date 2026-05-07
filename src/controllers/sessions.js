const Attendance = require("../models/attendance.js");
const Sessions = require("../models/sessions.js");

exports.createSession = async (req, res) => {
  try {
    const {
      role,
      trainer_id,
      batch_id,
      title,
      date,
      start_time,
      end_time,
    } = req.body;

    if (role !== "trainer") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const session = await Sessions.create({
      batch_id,
      trainer_id,
      title,
      date,
      start_time,
      end_time,
    });

    return res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create session",
      error: error.message,
    });
  }
};

exports.getSessionAttendance = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (role !== "trainer") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const attendanceData = await Attendance.find({
      session_id: id,
    }).populate("student_id", "name clerk_user_id");

    return res.status(200).json({
      success: true,
      session_id: id,
      total_students: attendanceData.length,
      data: attendanceData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};

// controllers/student.js

const BatchStudents = require("../models/batch-students.js");

exports.getStudentDashboard = async (req, res) => {
  try {
    const { student_id } = req.params;

    // Find student batches
    const studentBatches = await BatchStudents.find({
      student_id,
    });

    const batchIds = studentBatches.map(
      (item) => item.batch_id
    );

    // Fetch sessions
    const sessions = await Sessions.find({
      batch_id: { $in: batchIds },
    }).sort({ date: -1 });

    // Fetch attendance records
    const attendanceRecords = await Attendance.find({
      student_id,
    });

    const attendanceSessionIds = attendanceRecords.map(
      (item) => item.session_id.toString()
    );

    const formattedSessions = sessions.map((session) => ({
      id: session._id,
      title: session.title,
      start_time: session.start_time,
      end_time: session.end_time,
      date: session.date,
      attended: attendanceSessionIds.includes(
        session._id.toString()
      ),
    }));

    return res.status(200).json({
      success: true,
      total_sessions: formattedSessions.length,
      data: formattedSessions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student dashboard",
      error: error.message,
    });
  }
};