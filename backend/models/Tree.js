const mongoose = require('mongoose');

const TreeSchema = new mongoose.Schema({
  forestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forest', required: true },
  species: { type: String, required: true },
  age: { type: Number, required: true },
  healthStatus: { type: String, enum: ['Good', 'Average', 'Poor'], required: true }
});

module.exports = mongoose.model('Tree', TreeSchema);