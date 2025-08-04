// models/Ward.js
const mongoose = require('mongoose');

const WardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: Number, required: true },
  constituencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'constituency', required: true },
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ward', WardSchema);
