const AdminRole = require('../models/AdminRoleModel');
const { default: mongoose } = require('mongoose');

exports.createAdminRole = async (req, res) => {
    try {
        const { name, permission } = req.body;
        const adminRole = await AdminRole.findOne({ name });
        if (adminRole) {
            return res.status(400).send({
                sts: 1,
                msg: 'Role name already exists',
            });
        }
        const newAdminRole = new AdminRole();
        newAdminRole.name = name;
        const slugData = name.replace(/\s+/g, '-').replace(/[&\/\\@#,+()$~%.'":*?<>{}]/g, '').toLowerCase();
        newAdminRole.slug = await validateSlug(slugData);
        newAdminRole.permission = permission;
        await newAdminRole.save();
        return res.status(200).send({
            sts: 0,
            msg: 'The admin role has been created successfully',
        })
    } catch (err) {
        console.log(err, 'errerr');
        return res.status(500).send({
            sts: 1,
            msg: 'Serer Error',
            error: err.messages,
        });
    }
}

exports.getAdminRoleList = async (req, res) => {
    try {
        let { limit, offset = 0, name = '' } = req.query;
        offset = parseInt(offset) || 0;
        limit = limit ? parseInt(limit) : null; // null means no limit

        const filter = { isDelete: false };
        if (name && name.trim()) {
            filter.name = { $regex: name.trim(), $options: 'i' };
        }
        const totalCount = await AdminRole.countDocuments(filter);

        let query = AdminRole.find(filter).sort({ createdAt: -1 });

        if (limit) {
            query = query.skip(offset).limit(limit);
        }

        const data = await query;

        return res.status(200).send({
            sts: 0,
            msg: 'Success',
            data,
            count: totalCount,
        });

    } catch (err) {
        return res.status(500).send({
            sts: 1,
            msg: 'Server Error',
            error: err.message
        });
    }
};

exports.getAdminRoleDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await AdminRole.findOne({ _id: id, isDelete: false });

        if (!role) {
            return res.status(404).send({
                sts: 1,
                msg: 'Role not found',
            });
        }

        return res.status(200).send({
            sts: 0,
            msg: 'Success',
            data: role
        });

    } catch (err) {
        return res.status(500).send({
            sts: 1,
            msg: 'Server Error',
            error: err.message
        });
    }
};

exports.updateAdminRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, permission } = req.body;
        // Find existing role
        const existingRole = await AdminRole.findOne({ _id: id, isDelete: false });

        if (!existingRole) {
            return res.status(404).send({
                sts: 1,
                msg: 'Role not found'
            });
        }

        if (name && name.trim() && name.trim() !== existingRole.name) {
            const duplicateRole = await AdminRole.findOne({
                name: name.trim(),
                _id: { $ne: id }
            });
            if (duplicateRole) {
                return res.status(400).send({
                    sts: 1,
                    msg: 'A role with this name already exists'
                });
            }

            // Update name and slug
            existingRole.name = name.trim();
            const slugData = name
                .replace(/\s+/g, '-')
                .replace(/[&\/\\@#,+()$~%.'":*?<>{}]/g, '')
                .toLowerCase();
            existingRole.slug = await validateSlug(slugData, id);
        }

        if (permission !== undefined) {
            existingRole.permission = permission;
        }

        await existingRole.save();

        return res.status(200).send({
            sts: 0,
            msg: 'The admin role has been updated successfully',
            data: existingRole
        });

    } catch (err) {
        console.error('Error updating AdminRole:', err);
        return res.status(500).send({
            sts: 1,
            msg: 'Server Error',
            error: err.message
        });
    }
};

exports.deleteAdminRole = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await AdminRole.findOne({ _id: id, isDelete: false });
        if (!role) {
            return res.status(404).send({
                sts: 1,
                msg: 'Role not found',
            });
        }

        // Soft delete
        role.isDelete = true;
        await role.save();

        return res.status(200).send({
            sts: 0,
            msg: 'The admin role has been deleted successfully'
        });

    } catch (err) {
        console.error('Error deleting AdminRole:', err);
        return res.status(500).send({
            sts: 1,
            msg: 'Server Error',
            error: err.message
        });
    }
};

exports.deleteMultipleAdminRoles = async (req, res) => {
    try {
        const { ids } = req.body; // expecting array of IDs

        // Soft delete all
        const result = await AdminRole.updateMany(
            { _id: { $in: ids } },
            { $set: { isDelete: true } }
        );

        return res.status(200).send({
            sts: 0,
            msg: `${result.modifiedCount} roles have been deleted successfully`
        });

    } catch (err) {
        console.error('Error deleting multiple AdminRoles:', err);
        return res.status(500).send({
            sts: 1,
            msg: 'Server Error',
            error: err.message
        });
    }
};

const validateSlug = async (slug, _id = '', count = 0) => {
    const filter = { slug };

    if (_id) {
        filter._id = { $ne: new mongoose.Types.ObjectId(_id) };
    }

    const findSlug = await AdminRole.findOne(filter);

    if (findSlug) {
        count += 1;
        return validateSlug(`${slug}${count}`, _id, count);
    } else {
        return slug;
    }
};