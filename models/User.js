const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Admin", "Viewer"],
    required: true,
  },
});


module.exports=mongoose.model("User",userSchema);
