const mongoose = require('mongoose');


const patrolLogSchema = new mongoose.Schema({
  forestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forest', required: true },
  ranger: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  notes: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('PatrolLog', patrolLogSchema);
