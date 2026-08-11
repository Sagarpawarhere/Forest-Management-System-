const EnvironmentalData = require('../models/EnvironmentalData');

exports.getEnvironmentalData = async (req, res) => {
  try {
    const data = await EnvironmentalData.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addEnvironmentalData = async (req, res) => {
  try {
    const data = new EnvironmentalData(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};