const Attendance = require("../models/attendance");
const User = require("../models/users");

exports.markAttendance = async (req, res) => {
  try {
    const { student_id, session_id, status } = req.body;

    // Validate required fields
    if (!student_id || !session_id || !status) {
      return res.status(400).json({
        success: false,
        message: "student_id, session_id and status are required",
      });
    }

    // Find user
    const student = await User.findById(student_id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check role
    if (student.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Only students can mark attendance",
      });
    }

    // Create attendance
    const attendance = await Attendance.create({
      session_id,
      student_id,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Mark Attendance Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};