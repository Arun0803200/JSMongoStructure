const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    gender: { type: String, enum: ['male', 'female', 'others'], required: true },
    mobileNumber: { type: String, required: true },
    password: { type: String },
    confirmPassword: { type: String },
    address: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdByRole: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AdminUser', AdminUserSchema);
