const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  projects: [{
    startDate: Date,
    endDate: Date,
    amount: Number
  }],
  discount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('User', userSchema);
