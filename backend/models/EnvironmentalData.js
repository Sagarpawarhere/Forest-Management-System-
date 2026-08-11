const mongoose = require('mongoose');

const EnvironmentalDataSchema = new mongoose.Schema({
  forestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forest', required: true },
  temperature: { type: Number, required: true },
  rainfall: { type: Number, required: true },
  soilMoisture: { type: Number, required: true },
  recordedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EnvironmentalData', EnvironmentalDataSchema);