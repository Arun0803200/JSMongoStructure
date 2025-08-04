const Constituency = require('../models/ConstituencyModel');

// CREATE
exports.createConstituency = async (req, res) => {
  try {
    const { name, code, state, district } = req.body;

    const existing = await Constituency.findOne({ name });
    if (existing) return res.status(400).send({ message: 'Constituency already exists' });

    const constituency = new Constituency({ name, code, state, district });
    await constituency.save();

    res.status(201).send({ sts: 1, msg: 'Constituency created successfully' });
  } catch (error) {
    res.status(500).send({ sts: 0, msg: 'Error creating constituency', err: error.message });
  }
};

// READ ALL (with optional filters for isActive/isDelete)
exports.getAllConstituencies = async (req, res) => {
  try {
    const constituencies = await Constituency.find({ isDelete: false });
    res.status(200).send({sts: 1, msg: 'Success', data: constituencies });
  } catch (error) {
    res.status(500).send({ sts: 0, msg: 'Error fetching constituencies', err: error.message });
  }
};

// READ ONE BY ID
exports.getConstituencyById = async (req, res) => {
  try {
    const { id } = req.params;
    const constituency = await Constituency.findById(id);

    if (!constituency || constituency.isDelete)
      return res.status(400).send({ sts: 1, msg: 'Constituency not found' });

    res.status(200).send({ data: constituency });
  } catch (error) {
    res.status(500).send({ sts: 0, msg: 'Error fetching constituency', err: error.message });
  }
};

// UPDATE
exports.updateConstituency = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, state, district, isActive } = req.body;

    const updated = await Constituency.findByIdAndUpdate(
      id,
      { name, code, state, district, isActive },
      { new: true }
    );

    if (!updated)
      return res.status(400).send({ sts: 0, msg: 'Constituency not found' });

    res.status(200).send({ sts: 1, msg: 'Constituency updated successfully', data: updated });
  } catch (error) {
    res.status(500).send({ sts: 0, msg: 'Error updating constituency', err: error.message });
  }
};

// DELETE (Soft delete)
exports.deleteConstituency = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Constituency.findByIdAndUpdate(
      id,
      { isDelete: true },
      { new: true }
    );

    if (!deleted)
      return res.status(404).send({ sts: 0, msg: 'Constituency not found' });

    res.status(200).send({ sts: 1, msg: 'Constituency deleted successfully' });
  } catch (error) {
    res.status(500).send({ msg: 'Error deleting constituency', err: error.message });
  }
};

// MULTIPLE DELETE (Soft)
exports.deleteMultipleConstituencies = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({ sts: 0, msg: 'Invalid input. Pass an array of constituency IDs.' });
    }

    const result = await Constituency.updateMany(
      { _id: { $in: ids } },
      { $set: { isDelete: true } }
    );

    res.status(200).send({ sts: 1, msg: 'Constituencies deleted successfully' });
  } catch (error) {
    res.status(500).send({ sts: 0, msg: 'Error deleting constituencies', err: error.message });
  }
};

