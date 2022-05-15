const { model, Schema } = require('mongoose');

const workspacesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
  },
  path: {
    type: String,
  },
  userId: String,
  username: String,
  published: String,
  publish_status: String,
  domain_name: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = model('Workspaces', workspacesSchema);