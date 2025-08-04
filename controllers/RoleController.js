const Role = require('../models/RoleModel');

// CREATE
exports.createRole = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const exists = await Role.findOne({ name });
    if (exists) return res.status(400).send({ message: 'Role already exists' });

    const role = new Role({ name, slug });
    await role.save();

    res.status(201).send({ sts: 1, msg: 'Role created successfully' });
  } catch (error) {
    res.status(500).send({ sts: 0, msg: 'Error creating role', err: error.message });
  }
};

// READ ALL
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isDelete: false });
    res.status(200).send({ sts: 1, msg: 'Success', data: roles });
  } catch (error) {
    res.status(500).send({ sts: 0, msg: 'Error fetching roles', err: error.message });
  }
};

// READ ONE
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);

    if (!role || role.isDelete)
      return res.status(404).send({ sts: 0, msg: 'Role not found' });

    res.status(200).send({ data: role });
  } catch (error) {
    res.status(500).send({ sts: 1, msg: 'Error fetching role', err: error.message });
  }
};

// UPDATE
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, isActive } = req.body;

    const updated = await Role.findByIdAndUpdate(
      id,
      { name, slug, isActive },
      { new: true }
    );

    if (!updated)
      return res.status(404).send({ sts: 0, message: 'Role not found' });

    res.status(200).send({ message: 'Role updated successfully', data: updated });
  } catch (error) {
    res.status(500).send({ message: 'Error updating role', error: error.message });
  }
};

// DELETE (Soft Delete)
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Role.findByIdAndUpdate(
      id,
      { isDelete: true },
      { new: true }
    );

    if (!deleted)
      return res.status(400).send({ sts: 0, msg: 'Role not found' });

    res.status(200).send({ sts: 1, msg: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).send({ sts: 0, msg: 'Error deleting role', err: error.message });
  }
};

// MULTIPLE DELETE (Soft)
exports.deleteMultipleRoles = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({ sts: 0, msg: 'Invalid input. Pass an array of role IDs.' });
    }

    await Role.updateMany(
      { _id: { $in: ids } },
      { $set: { isDelete: true } }
    );

    res.status(200).send({ sts: 1, msg: 'Roles deleted successfully' });
  } catch (error) {
    res.status(500).send({ sts: 0, msg: 'Error deleting roles', err: error.message });
  }
};
