const Tree = require('../models/Tree');

exports.getTrees = async (req, res) => {
  try {
    const trees = await Tree.find();
    res.json(trees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTree = async (req, res) => {
  try {
    const tree = new Tree(req.body);
    await tree.save();
    res.status(201).json(tree);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTree = async (req, res) => {
  try {
    const tree = await Tree.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tree) return res.status(404).json({ message: 'Tree not found' });
    res.json(tree);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTree = async (req, res) => {
  try {
    const tree = await Tree.findByIdAndDelete(req.params.id);
    if (!tree) return res.status(404).json({ message: 'Tree not found' });
    res.json({ message: 'Tree deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};