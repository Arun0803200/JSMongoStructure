// models/Skill.js
const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false },
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', SkillSchema);
