const express = require('express');
const router = express.Router();
const treeController = require('../controllers/treeController');
// const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { checkSchema, validationResult } = require('express-validator');

const treeSchema = {
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

router.get('/', treeController.getTrees);
router.post('/', checkSchema(treeSchema), validate, treeController.createTree);
router.put('/:id', checkSchema(treeSchema), validate, treeController.updateTree);
router.delete('/:id', treeController.deleteTree);

module.exports = router;