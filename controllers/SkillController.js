const Skill = require('../models/Skill');

// CREATE
exports.createSkill = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const exists = await Skill.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Skill already exists' });

    const skill = new Skill({ name, slug });
    await skill.save();

    res.status(201).json({ message: 'Skill created successfully', data: skill });
  } catch (error) {
    res.status(500).json({ message: 'Error creating skill', error: error.message });
  }
};

// READ ALL
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ isDelete: false });
    res.status(200).json({ data: skills });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error: error.message });
  }
};

// READ ONE
exports.getSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);

    if (!skill || skill.isDelete)
      return res.status(404).json({ message: 'Skill not found' });

    res.status(200).json({ data: skill });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skill', error: error.message });
  }
};

// UPDATE
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, isActive } = req.body;

    const updated = await Skill.findByIdAndUpdate(
      id,
      { name, slug, isActive },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: 'Skill not found' });

    res.status(200).json({ message: 'Skill updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating skill', error: error.message });
  }
};

// DELETE (Soft Delete)
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Skill.findByIdAndUpdate(
      id,
      { isDelete: true },
      { new: true }
    );

    if (!deleted)
      return res.status(404).json({ message: 'Skill not found' });

    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skill', error: error.message });
  }
};

// MULTIPLE DELETE (Soft)
exports.deleteMultipleSkills = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid input. Pass an array of skill IDs.' });
    }

    const result = await Skill.updateMany(
      { _id: { $in: ids } },
      { $set: { isDelete: true } }
    );

    res.status(200).json({ message: 'Skills deleted successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skills', error: error.message });
  }
};

