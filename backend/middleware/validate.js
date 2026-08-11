// Simple input validation middleware generator
const { validationResult, checkSchema } = require('express-validator');

function validate(schema) {
  return [
    checkSchema(schema),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() });
      }
      next();
    }
  ];
}

module.exports = validate;
