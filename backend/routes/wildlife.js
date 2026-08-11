const express = require('express');
const router = express.Router();
const wildlifeController = require('../controllers/wildlifeController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { checkSchema, validationResult } = require('express-validator');

const wildlifeSchema = {
	forestId: { notEmpty: true, isString: true },
	species: { notEmpty: true, isString: true },
	count: { isNumeric: true },
	recordedAt: { optional: true, isISO8601: true }
};

function validate(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ message: 'Validation error', errors: errors.array() });
	}
	next();
}

router.get('/', wildlifeController.getWildlife);
router.put('/:id', authenticateJWT, authorizeRoles('admin','officer'), checkSchema(wildlifeSchema), validate, wildlifeController.updateWildlife);
router.post('/', checkSchema(wildlifeSchema), validate, wildlifeController.createWildlife);
router.delete('/:id', wildlifeController.deleteWildlife);

module.exports = router;
