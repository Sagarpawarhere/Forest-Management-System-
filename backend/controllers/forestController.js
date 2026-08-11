const Forest = require('../models/Forest');

exports.getForests = async (req, res) => {
  try {
    const forests = await Forest.find();
    res.json(forests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createForest = async (req, res) => {
  try {
    const forest = new Forest(req.body);
    await forest.save();
    res.status(201).json(forest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateForest = async (req, res) => {
  try {
    const forest = await Forest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!forest) return res.status(404).json({ message: 'Forest not found' });
    res.json(forest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteForest = async (req, res) => {
  try {
    const forest = await Forest.findByIdAndDelete(req.params.id);
    if (!forest) return res.status(404).json({ message: 'Forest not found' });
    res.json({ message: 'Forest deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};