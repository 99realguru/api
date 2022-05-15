const { model, Schema } = require('mongoose');

const plansSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  package:{
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  project_count: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = model('Plans', plansSchema);