const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerk_id: { type: String ,allowNull:true},
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "trainer", "institution", "manager", "monitoring"],
    required: true,
  },
  institution_id: {
    type: String,
    default: null,
  },
}, { timestamps: { createdAt: "created_at", updatedAt: false } });

module.exports = mongoose.model("User", userSchema);