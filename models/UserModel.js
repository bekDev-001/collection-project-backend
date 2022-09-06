const { Schema, model } = require("mongoose");
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
  },
  email: {
    type: String,
    required: true,
  },
  lastLogin: Date,
  registrationDate: Date,
  status: {
    type: Boolean,
    default: false,
  },
  joinedAt: Date,
});
const userModel = model("users", UserSchema);
module.exports = { userModel };