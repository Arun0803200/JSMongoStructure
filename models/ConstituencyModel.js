// models/Constituency.js
const mongoose = require('mongoose');

const ConstituencySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String },
  state: { type: String },
  district: { type: String },
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('constituency', ConstituencySchema);
