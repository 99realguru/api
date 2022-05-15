const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  name: String,
  email: String,
  phone: Number,
  username: String,
  password: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = model('Users', userSchema);
