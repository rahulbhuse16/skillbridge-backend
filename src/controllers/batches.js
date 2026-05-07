const batchStudents = require("../models/batch-students.js");
const batchTrainers = require("../models/batch-trainers.js");
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
    const { id } = req.params;

    if (role !== "trainer") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const inviteToken = `${id}-${Date.now()}`;

    return res.status(200).json({
      success: true,
      invite_link: `/batches/${id}/join?token=${inviteToken}`,
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
    const { student_id, role } = req.body;
    const { id } = req.params;

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
  const id=req.params.id
  try {
    const batches = await Batch.find({}, {
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