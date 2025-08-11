const mongoose = require('mongoose');
const { type } = require('os');

const ModuleGroupSchema = new mongoose.Schema({
    name: {
        type: String, required: true,
    },
    slug: {
        type: String, required: true,
    },
    priority: {
        type: Number, required: true,
    },
    actions: [
        {
            name: { type: String, required: true },
            slug: { type: String, required: true },
            priority: { type: Number, required: true },
        }
    ]
}, {
    timestamps: true,
});
module.exports = mongoose.model('ModuleGroup', ModuleGroupSchema);
