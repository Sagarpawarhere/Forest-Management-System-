const express = require('express');
const router = express.Router();
const Species = require('../models/Species');
// const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { checkSchema, validationResult } = require('express-validator');

const speciesSchema = {
  forestId: { notEmpty: true, isString: true },
  species: { notEmpty: true, isString: true },
  age: { isNumeric: true },
  healthStatus: { isIn: { options: [['Good', 'Average', 'Poor']] } }
};

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
	return res.status(400).json({ message: 'Validation error', errors: errors.array() });
  }
  next();
}

// Create species
router.post('/', checkSchema(speciesSchema), validate, async (req, res) => {
   try {
	   const species = new Species(req.body);
	   const saved = await species.save();
	   res.status(201).json(saved);
   } catch (err) {
	   res.status(400).json({ message: err.message });
   }
});

// Get all species
   router.get('/', async (req, res) => {
   try {
	   const all = await Species.find();
	   res.json(all);
   } catch (err) {
	   res.status(500).json({ message: err.message });
   }
});

// Get one species
router.get('/:id', async (req, res) => {
   try {
	   const item = await Species.findById(req.params.id);
	   if (!item) return res.status(404).json({ message: 'Species not found' });
	   res.json(item);
   } catch (err) {
	   res.status(500).json({ message: err.message });
   }
});

// Update species
router.put('/:id', checkSchema(speciesSchema), validate, async (req, res) => {
   try {
	   const updated = await Species.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
	   if (!updated) return res.status(404).json({ message: 'Species not found' });
	   res.json(updated);
   } catch (err) {
	   res.status(400).json({ message: err.message });
   }
});

// Delete species
router.delete('/:id', async (req, res) => {
   try {
	   const deleted = await Species.findByIdAndDelete(req.params.id);
	   if (!deleted) return res.status(404).json({ message: 'Species not found' });
	   res.json({ message: 'Species deleted' });
   } catch (err) {
	   res.status(500).json({ message: err.message });
   }
});

module.exports = router;

