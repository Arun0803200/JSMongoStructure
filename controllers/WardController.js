const Ward = require('../models/Ward');

// CREATE
exports.createWard = async (req, res) => {
  try {
    const { name, number, constituencyId } = req.body;

    const ward = new Ward({ name, number, constituencyId });
    await ward.save();

    res.status(201).json({ message: 'Ward created successfully', data: ward });
  } catch (error) {
    res.status(500).json({ message: 'Error creating ward', error: error.message });
  }
};

// READ ALL
exports.getAllWards = async (req, res) => {
  try {
    const wards = await Ward.find({ isDelete: false }).populate('constituencyId', 'name');
    res.status(200).json({ data: wards });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wards', error: error.message });
  }
};

// READ ONE
exports.getWardById = async (req, res) => {
  try {
    const { id } = req.params;
    const ward = await Ward.findById(id).populate('constituencyId', 'name');

    if (!ward || ward.isDelete)
      return res.status(404).json({ message: 'Ward not found' });

    res.status(200).json({ data: ward });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ward', error: error.message });
  }
};

// UPDATE
exports.updateWard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, number, constituencyId, isActive } = req.body;

    const updated = await Ward.findByIdAndUpdate(
      id,
      { name, number, constituencyId, isActive },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: 'Ward not found' });

    res.status(200).json({ message: 'Ward updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating ward', error: error.message });
  }
};

// DELETE (Soft Delete)
exports.deleteWard = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Ward.findByIdAndUpdate(
      id,
      { isDelete: true },
      { new: true }
    );

    if (!deleted)
      return res.status(404).json({ message: 'Ward not found' });

    res.status(200).json({ message: 'Ward deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ward', error: error.message });
  }
};

// MULTIPLE DELETE (Soft Delete)
exports.deleteMultipleWards = async (req, res) => {
  try {
    const { ids } = req.body; // array of IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid input. Pass an array of ward IDs.' });
    }

    const result = await Ward.updateMany(
      { _id: { $in: ids } },
      { $set: { isDelete: true } }
    );

    res.status(200).json({ message: 'Wards deleted successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting wards', error: error.message });
  }
};
