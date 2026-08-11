const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { checkSchema } = require('express-validator');

const registerSchema = {
	name: { notEmpty: true, isString: true },
	email: { isEmail: true },
	password: { isLength: { options: { min: 6 } } },
	role: { optional: true, isIn: { options: [['admin', 'officer']] } }
};

const loginSchema = {
	email: { isEmail: true },
	password: { notEmpty: true }
};

const { validationResult } = require('express-validator');
function validate(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ message: 'Validation error', errors: errors.array() });
	}
	next();
}

router.post('/register', checkSchema(registerSchema), validate, register);
router.post('/login', checkSchema(loginSchema), validate, login);

module.exports = router;

