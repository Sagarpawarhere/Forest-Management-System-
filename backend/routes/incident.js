const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
// const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { checkSchema, validationResult } = require('express-validator');

const incidentSchema = {
  forestId: { notEmpty: true, isString: true },
  type: { isIn: { options: [['fire', 'illegal logging', 'encroachment']] } },
  severity: { isIn: { options: [['low', 'medium', 'high']] } },
  description: { notEmpty: true, isString: true },
  date: { isISO8601: true }
};

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
	return res.status(400).json({ message: 'Validation error', errors: errors.array() });
  }
  next();
}

// Create incident
router.post('/', checkSchema(incidentSchema), validate, async (req, res) => {
   try {
	   const incident = new Incident(req.body);
	   const saved = await incident.save();
	   res.status(201).json(saved);
   } catch (err) {
	   res.status(400).json({ message: err.message });
   }
});

// Get all incidents
router.get('/', async (req, res) => {
   try {
	   const all = await Incident.find();
	   res.json(all);
   } catch (err) {
	   res.status(500).json({ message: err.message });
   }
});

// Get one incident
router.get('/:id', async (req, res) => {
   try {
	   const item = await Incident.findById(req.params.id);
	   if (!item) return res.status(404).json({ message: 'Incident not found' });
	   res.json(item);
   } catch (err) {
	   res.status(500).json({ message: err.message });
   }
});

// Update incident
router.put('/:id', checkSchema(incidentSchema), validate, async (req, res) => {
   try {
	   const updated = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
	   if (!updated) return res.status(404).json({ message: 'Incident not found' });
	   res.json(updated);
   } catch (err) {
	   res.status(400).json({ message: err.message });
   }
});

// Delete incident
router.delete('/:id', async (req, res) => {
   try {
	   const deleted = await Incident.findByIdAndDelete(req.params.id);
	   if (!deleted) return res.status(404).json({ message: 'Incident not found' });
	   res.json({ message: 'Incident deleted' });
   } catch (err) {
	   res.status(500).json({ message: err.message });
   }
});

module.exports = router;

