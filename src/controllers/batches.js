const batchStudents = require("../models/batch-students.js");
const batchTrainers = require("../models/batch-trainers.js");
const Batch = require("../models/Batch.js");


exports.createBatch = async (req, res) => {
  if (!["trainer", "institution"].includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const batch = await Batch.create({
    name: req.body.name,
    institution_id: req.user.institution_id,
  });

  if (req.user.role === "trainer") {
    await batchTrainers.create({
      batch_id: batch._id,
      trainer_id: req.user._id,
    });
  }

  res.json(batch);
};

exports.generateInvite = async (req, res) => {
  if (req.user.role !== "trainer") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const inviteToken = `${req.params.id}-${Date.now()}`;

  res.json({
    invite_link: `/batches/${req.params.id}/join?token=${inviteToken}`,
  });
};

exports.joinBatch = async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Forbidden" });
  }

  await batchStudents.create({
    batch_id: req.params.id,
    student_id: req.user._id,
  });

  res.json({ message: "Joined batch" });
};