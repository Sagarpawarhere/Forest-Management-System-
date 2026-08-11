const express = require('express');
const router = express.Router();
const PatrolLog = require('../models/PatrolLog');
// const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { checkSchema, validationResult } = require('express-validator');

const patrolLogSchema = {
  forestId: { notEmpty: true, isString: true },
  date: { isISO8601: true },
  notes: { optional: true, isString: true }
};

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation error', errors: errors.array() });
  }
  next();
}

// Create patrol log (officer or admin)
router.post('/', checkSchema(patrolLogSchema), validate, async (req, res) => {
  try {
    const log = new PatrolLog({ ...req.body, ranger: req.body.ranger || 'Demo Ranger' });
    const saved = await log.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all patrol logs (admin sees all, officer sees own)
router.get('/', async (req, res) => {
  try {
    const logs = await PatrolLog.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one patrol log (admin or own)
router.get('/:id', async (req, res) => {
  try {
    const item = await PatrolLog.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Patrol log not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update patrol log (admin only)
router.put('/:id', checkSchema(patrolLogSchema), validate, async (req, res) => {
  try {
    const updated = await PatrolLog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Patrol log not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete patrol log (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await PatrolLog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Patrol log not found' });
    res.json({ message: 'Patrol log deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
