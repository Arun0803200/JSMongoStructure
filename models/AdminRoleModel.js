const mongoose = require('mongoose');

const AdminRoleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    permission: {
        type: Array, required: true
    },
    isDelete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('AdminRole', AdminRoleSchema);
