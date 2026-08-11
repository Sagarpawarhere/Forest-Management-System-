const mongoose = require('mongoose');


const speciesSchema = new mongoose.Schema({
  forestId: { type: String, required: true },
  species: { type: String, required: true },
  age: { type: Number, required: true },
  healthStatus: { type: String, enum: ['Good', 'Average', 'Poor'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Species', speciesSchema);

