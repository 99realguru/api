const { model, Schema } = require('mongoose');

const planspurchasedSchema = new Schema({
  userId:{
    type: String,
    require: true,
  },
  planId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = model('Planpurchased', planspurchasedSchema);