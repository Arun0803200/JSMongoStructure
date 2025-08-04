const User = require("../models/user.model");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkMulterData = async (req, res) => {

}

exports.createUser = async (req, res) => {
  try {
    const { 
      firstName,
      lastName,
      gender,
      dateOfBirth,
      mobileNumber,
      constituencyId,
      wardId,
      profilePhoto,
      idProof,
      address,
      wasInOtherParty,
      formerParty,
      formerRole,
      roleId
     } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
