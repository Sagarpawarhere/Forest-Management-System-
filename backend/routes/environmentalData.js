const express = require('express');
const router = express.Router();
const environmentalDataController = require('../controllers/environmentalDataController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { checkSchema, validationResult } = require('express-validator');

const environmentalDataSchema = {
	forestId: { notEmpty: true, isString: true },
	temperature: { isNumeric: true },
	rainfall: { isNumeric: true },
	soilMoisture: { isNumeric: true },
	recordedAt: { optional: true, isISO8601: true }
};

function validate(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ message: 'Validation error', errors: errors.array() });
	}
	next();
}

router.get('/', environmentalDataController.getEnvironmentalData);
router.post('/', authenticateJWT, authorizeRoles('admin','officer'), checkSchema(environmentalDataSchema), validate, environmentalDataController.addEnvironmentalData);

module.exports = router;
