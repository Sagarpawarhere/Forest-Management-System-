const Wildlife = require('../models/Wildlife');

exports.getWildlife = async (req, res) => {
  try {
    const wildlife = await Wildlife.find();
    res.json(wildlife);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createWildlife = async (req, res) => {
  try {
    const wildlife = new Wildlife(req.body);
    await wildlife.save();
    res.status(201).json(wildlife);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateWildlife = async (req, res) => {
  try {
    const wildlife = await Wildlife.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!wildlife) return res.status(404).json({ message: 'Wildlife not found' });
    res.json(wildlife);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteWildlife = async (req, res) => {
  try {
    const wildlife = await Wildlife.findByIdAndDelete(req.params.id);
    if (!wildlife) return res.status(404).json({ message: 'Wildlife not found' });
    res.json({ message: 'Wildlife deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};