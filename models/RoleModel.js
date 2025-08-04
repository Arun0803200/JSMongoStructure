// models/Role.js
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: {type: String, required: true},
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Role', RoleSchema);
