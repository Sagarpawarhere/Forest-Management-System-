const express = require('express');
const router = express.Router();
const forestController = require('../controllers/forestController');
// const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { checkSchema, validationResult } = require('express-validator');

const forestSchema = {
	name: { notEmpty: true, isString: true },
	location: { notEmpty: true, isString: true },
	area: { isNumeric: true }
};

function validate(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ message: 'Validation error', errors: errors.array() });
	}
	next();
}

router.get('/', forestController.getForests);
router.post('/', checkSchema(forestSchema), validate, forestController.createForest);
router.put('/:id', checkSchema(forestSchema), validate, forestController.updateForest);
router.delete('/:id', forestController.deleteForest);

module.exports = router;