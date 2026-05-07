const batchStudents = require("../models/batch-students.js");
const batchTrainers = require("../models/batch-trainers.js");
const Sessions = require("../models/sessions.js");
const BatchStudents = require("../models/batch-students.js");
const BatchTrainers = require("../models/batch-trainers.js");
const Attendance = require("../models/attendance.js");
const Batch = require("../models/batch.js");

exports.createBatch = async (req, res) => {
  try {
    const { name, institution_id, trainer_id, role } = req.body;

    if (!["trainer", "institution"].includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const batch = await Batch.create({
      name,
      institution_id,
    });

    if (role === "trainer") {
      await batchTrainers.create({
        batch_id: batch._id,
        trainer_id,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: batch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create batch",
      error: error.message,
    });
  }
};

exports.generateInvite = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.body;

    if (role !== "trainer") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const inviteToken = `${id}-${Date.now()}`;

    return res.status(200).json({
      success: true,
      invite_link: `https://skillbridge-xva3.onrender.com/batches/${id}/join`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate invite link",
      error: error.message,
    });
  }
};

exports.joinBatch = async (req, res) => {
  try {
    const { student_id, role,id } = req.body;

    if (role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    await batchStudents.create({
      batch_id: id,
      student_id,
    });

    return res.status(200).json({
      success: true,
      message: "Joined batch successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to join batch",
      error: error.message,
    });
  }
};


exports.getBatches = async (req, res) => {
  try {
    const { id } = req.params;

    const batches = await Batch.find({
      institution_id: id,
    });

    const formattedBatches = batches.map((batch) => ({
      id: batch._id,
      name: batch.name,
    }));

    return res.status(200).json({
      success: true,
      total: formattedBatches.length,
      data: formattedBatches,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch batches",
      error: error.message,
    });
  }
};


// controllers/trainer.js



exports.getTrainerDashboard = async (req, res) => {
  try {
    const { trainer_id } = req.params;

    // Trainer batches
    const trainerBatches = await BatchTrainers.find({
      trainer_id,
    });

    const batchIds = trainerBatches.map(
      (item) => item.batch_id
    );

    // Sessions count
    const sessions = await Sessions.find({
      trainer_id,
    }).sort({ createdAt: -1 });

    // Students count
    const students = await BatchStudents.find({
      batch_id: { $in: batchIds },
    });

    // Attendance
    const attendance = await Attendance.find({
      session_id: {
        $in: sessions.map((s) => s._id),
      },
    });

    const presentCount = attendance.filter(
      (a) => a.status === "present"
    ).length;

    const attendancePercentage =
      attendance.length > 0
        ? Math.round(
            (presentCount / attendance.length) * 100
          )
        : 0;

    const recentSessions = sessions.slice(0, 5);

    return res.status(200).json({
      success: true,

      stats: {
        total_sessions: sessions.length,
        total_students: students.length,
        attendance_percentage: attendancePercentage,
      },

      recent_sessions: recentSessions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};