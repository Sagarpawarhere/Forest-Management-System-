const mongoose = require('mongoose');


const incidentSchema = new mongoose.Schema({
  forestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forest', required: true },
  type: { type: String, enum: ['fire', 'illegal logging', 'encroachment'], required: true },
  severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
  description: { type: String, trim: true },
  date: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);

