const attendance = require("../models/attendance.js");
const batch = require("../models/batch.js");
const sessions = require("../models/sessions.js");
const users = require("../models/users.js");


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
  try {
    // Role check
   

    const institutionId = req.params.id;

     const user=await users.findById(institutionId)




     if (user.role !== "institution") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    // Get all batches of institution
    const batches = await batch.find({
      institution_id: institutionId,
    });

    // Create response list with attendance %
    const batchList = await Promise.all(
      batches.map(async (item) => {
        const totalAttendance = await attendance.countDocuments({
          session_id: { $exists: true },
        });

        const presentAttendance = await attendance.countDocuments({
          status: "present",
        });

        const attendancePercentage =
          totalAttendance > 0
            ? Math.round((presentAttendance / totalAttendance) * 100)
            : 0;

        return {
          batch_id: item._id,
          batch_name: item.name,
          attendance_percentage: attendancePercentage,
        };
      })
    );

    return res.status(200).json({
      success: true,
      total_batches: batches.length,
      batches: batchList,
    });
  } catch (error) {
    console.error("Institution Summary Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
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