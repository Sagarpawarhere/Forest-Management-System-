const mongoose = require('mongoose');

const WildlifeSchema = new mongoose.Schema({
  forestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forest', required: true },
  species: { type: String, required: true },
  count: { type: Number, required: true },
  recordedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wildlife', WildlifeSchema);