const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  batch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    required: true,
  },
  createdAt:{
    type: Date,
    default: new Date()
  }
}, { timestamps: { createdAt: "created_at", updatedAt: false } });

const Notifications = mongoose.models.Notifications || mongoose.model("Notifications", notificationsSchema);
module.exports = Notifications;