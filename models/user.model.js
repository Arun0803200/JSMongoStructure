const {mongoose, Schema} = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {type: String},
  lastName: {type: String},
  gender: {type: String, enum: ['male', 'female', 'others']},
  dateOfBirth: {type: Date},
  mobileNumber: {type: String, required: true},
  constituencyId: {type: Schema.Types.ObjectId},
  wardId: {type: Schema.Types.ObjectId},
  profilePhoto: {type: String},
  idProof: {type: String},
  address: {type: String},
  wasInOtherParty: {type: Boolean},
  formerParty: { type: String }, // previous party name
  formerRole: { type: String }, // preious party role name
  skillIds: {type: [Schema.Types.ObjectId]},
  roleId: {type: Schema.Types.ObjectId, required: true},
  isWillingToVolunteer: {type: Boolean, required: true},
  isActive: {type: Boolean, default: true},
  isDelete: {type: Boolean, default: false},
}, {
  timestamps: true
});

module.exports = mongoose.model("User", UserSchema);
