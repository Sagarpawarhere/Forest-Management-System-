const mongoose = require('mongoose');

const ForestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  area: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Forest', ForestSchema);